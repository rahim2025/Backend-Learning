import express from 'express';
import { Express } from 'express';
import { env } from './config/env';
import productRouter from "./routes/product.routes"

const app:Express = express();


app.use(express.json())
app.use("/api/products",productRouter)

app.listen(env.port,()=>{
    console.log(`Server started on PORT: ${env.port}`)
    

})

