const express = require("express");

const PORT = 3000;
const app = express();

app.get("/",(req,res)=>{
    console.log("This is a get request ");
})
app.post("/",(req,res)=>{
    console.log("This is a post request ");
})
app.put("/",(req,res)=>{
    console.log("This is a put request ");
})
app.delete("/",(req,res)=>{
    console.log("This is a delete request ");
})

app.listen(PORT,()=>{
    console.log(`Server is listening on port: ${PORT}`)
})