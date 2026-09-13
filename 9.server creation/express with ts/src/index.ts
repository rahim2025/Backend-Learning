


import express from 'express';
import { Express } from 'express';
const app:Express = express();

const PORT:number = 3000;

app.get("/ping",(req,res) =>{
    console.log("Pong")
})

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})

