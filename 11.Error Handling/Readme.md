# Error Handling in Express 

Validation (previous topic) stops bad data from entering your system.
Error handling is what happens **after something still goes wrong** — bad data slipped through, a DB call failed, a third-party API timed out, or your own code threw a bug. A backend that can't fail predictably isn't production-ready, no matter how clean the happy path looks.

Good engineers don't think of error handling as "wrap it in try/catch." They think about it as a **system**: every error, from anywhere in the app, must end up in exactly one place, in a predictable shape, logged correctly, without crashing the process or leaking internals.

## Two categories of errors — this distinction drives every decision

- **Operational errors** — expected failures that happen during normal operation. Invalid input, resource not found, DB connection drop, third-party API timeout, duplicate key. These are *not bugs*. You anticipate them and handle them gracefully (return 4xx/5xx with a clean message).
- **Programmer errors** — bugs. `undefined is not a function`, calling `.map()` on `undefined`, forgetting to `await`. These indicate the code is in an unknown state. The correct move is usually to **log it, alert, and let the process crash** (and let a process manager restart it) rather than keep serving requests from a corrupted state.

Why this matters: if you treat programmer errors like operational errors (catch everything, always respond 500, keep running), you hide real bugs and let the process limp along in a broken state — memory leaks, stuck DB connections, corrupted in-memory caches. A senior engineer's error handling strategy explicitly separates these two.

## Express error-handling middleware — the core mechanism

Express recognizes an error-handling middleware by **arity: exactly 4 parameters**. If you define it with fewer/more, Express treats it as normal middleware and it will never be called for errors.

```ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
```

Register it **last**, after all routes:

```ts
app.use("/products", productRouter);
app.use("/users", userRouter);

app.use(errorHandler); // must be last
```

## Getting errors INTO the error handler

Express only auto-catches errors thrown **synchronously** inside a normal route handler. Anything async (a rejected Promise) will NOT reach your error handler unless you explicitly forward it.

```ts
// Works — synchronous throw, Express catches it automatically
app.get("/sync-bug", (req, res) => {
    throw new Error("boom");
});

// Does NOT reach errorHandler in Express 4 — unhandled rejection instead
app.get("/async-bug", async (req, res) => {
    const data = await someDbCallThatRejects(); // throws inside async fn
    res.json(data);
});
```

You must call `next(err)` explicitly:

```ts
app.get("/async-ok", async (req, res, next) => {
    try {
        const data = await someDbCallThatRejects();
        res.json(data);
    } catch (err) {
        next(err); // forwards to errorHandler
    }
});
```

Note: Express 5 auto-catches rejected promises from async handlers. If the project is on Express 4 (very common), you still need the pattern below.

## The asyncHandler wrapper — stop repeating try/catch

Writing try/catch in every async route is repetitive and easy to forget. Senior engineers centralize it once:

```ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
    (fn: RequestHandler) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
```

Usage:

```ts
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const product = await productService.findById(req.params.id);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        res.json({ success: true, data: product });
    })
);
```

No try/catch needed in the handler itself — any thrown error or rejected promise is funneled into `next(err)` automatically, which lands in the central error handler.

## Custom error classes — give errors shape and identity

A plain `Error` doesn't tell your error handler what HTTP status to send or whether it's safe to show the message to the client. Model errors as classes.

```ts
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // maintain proper stack trace (V8 only)
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}
```

`isOperational` is the key field: it's how the central handler decides "this is a known, safe-to-report error" vs "this is a bug, don't leak details."

## The central error handler, done properly

```ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";
import logger from "../utils/logger";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Known, validated application error
    if (err instanceof AppError) {
        logger.warn(err.message, { path: req.path, statusCode: err.statusCode });

        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // 2. Zod validation error that slipped through as a thrown error
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            errors: err.issues
        });
    }

    // 3. Unknown / programmer error — never leak details to the client
    logger.error(err.message, { stack: err.stack, path: req.path });

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
```

Key production rule: **never send `err.stack` or raw `err.message` for non-operational errors to the client.** That's an information disclosure vulnerability — it can reveal file paths, DB queries, internal library names, or stack internals to an attacker. Log it internally, return a generic message externally.

```ts
// BAD — leaks internals
res.status(500).json({ message: err.message, stack: err.stack });

// GOOD
res.status(500).json({ message: "Internal Server Error" });
```

If you want stack traces in dev but not prod:

```ts
res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
});
```

## 404 handler — a route that doesn't exist is also an "error"

Put this right before the error handler, after all real routes:

```ts
app.use((req, res, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);
```

## Handling errors Express never sees — process-level safety net

Express's error handler only catches errors inside the request/response cycle. Two categories escape it entirely and will crash Node silently (or leave it in a broken state) if unhandled:

```ts
// A rejected Promise with no .catch anywhere
process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection", reason);
    // Best practice: log, then gracefully shut down.
    // Don't keep running — the app's state may be inconsistent.
    process.exit(1);
});

// A synchronous throw outside of Express's request cycle
// (e.g. inside a setTimeout callback, a stream event, a cron job)
process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception", err);
    process.exit(1);
});
```

Why exit instead of "just log and continue"? Because an uncaught exception means the process's internal state is no longer guaranteed to be correct. Continuing to serve traffic from a corrupted process is worse than a controlled restart (which your process manager — PM2, Docker, Kubernetes — will do automatically).

## Graceful shutdown — closing the loop

When the process does need to exit (deploy, crash recovery, SIGTERM from Kubernetes), don't just kill it — stop accepting new connections, finish in-flight requests, close DB pools, then exit.

```ts
const server = app.listen(PORT);

const shutdown = () => {
    logger.info("Shutting down gracefully...");
    server.close(() => {
        db.disconnect().then(() => process.exit(0));
    });

    // force-kill if it hangs
    setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
```

## Putting it together — the full flow

```
request
  -> route handler (wrapped in asyncHandler)
    -> throws AppError / ZodError / unexpected Error
      -> next(err)
        -> central errorHandler middleware
          -> known error  -> clean 4xx JSON response
          -> unknown error -> log full detail, respond generic 500
```

```
process
  -> uncaughtException / unhandledRejection
    -> log
      -> graceful shutdown
        -> process manager restarts the app
```

## Common mistakes juniors make (and why they're wrong)

- **Swallowing errors silently** (`catch (e) {}`) — the request hangs or returns nothing; the bug becomes invisible.
- **try/catch in every single route handler** — repetitive, easy to forget one, use `asyncHandler` instead.
- **Returning `err.stack` or `err.message` directly to clients in production** — information disclosure.
- **Not distinguishing operational vs programmer errors** — either crashing on a normal 404, or limping along after a real bug.
- **Forgetting the 4-argument signature** — Express silently skips the middleware and falls back to its default (ugly, unstructured) error page.
- **Registering the error handler before routes** — it must be the *last* `app.use()`.
- **Not handling `unhandledRejection`/`uncaughtException`** — a single missed `.catch()` somewhere outside Express can crash the server with zero logging.

## Interview-ready summary

- Express detects error middleware purely by **4-parameter arity**.
- Sync throws inside handlers are auto-caught; **async rejections are not** (Express 4) — always call `next(err)` or use an `asyncHandler` wrapper.
- Model errors as classes (`AppError` + subclasses) carrying `statusCode` and `isOperational` so the central handler can branch cleanly.
- Never leak stack traces / raw messages for non-operational errors.
- Operational errors → handle gracefully. Programmer errors → log, alert, crash, restart.
- Process-level `uncaughtException`/`unhandledRejection` handlers are the safety net for what Express can never see.
- Always shut down gracefully: stop new connections, finish in-flight work, close DB pools, then exit.
