# async/await Error Handling

Use `try/catch` to handle errors with `async/await`.

```js
async function getUserHandler(req, res) {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).send("Failed to load user");
  }
}
```

If an awaited Promise rejects, JavaScript jumps to the nearest `catch`.

## Example

```js
async function run() {
  try {
    const user = await getUser(1);
    const orders = await getOrders(user.id);

    console.log(orders);
  } catch (error) {
    console.log("Failed:", error.message);
  }
}
```

## Common Mistake

Forgetting `try/catch` in backend route handlers:

```js
app.get("/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
});
```

If `getUser()` rejects, the route can fail unexpectedly.

Safer:

```js
app.get("/users/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to load user" });
  }
});
```

