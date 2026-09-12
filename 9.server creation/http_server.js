// Basic Http server using only nodejs


const http = require("http");

const server = http.createServer((req,res)=>{
    if (req.method == "GET"){
        res.end("Get Request Received")
    } else if (req.method == "POST"){
        res.end("Post Request Received")
    } else{
        res.end("Hello I am Rahim")
    }
});

const PORT = 3000;
server.listen(PORT,()=>{
    console.log(`Server started at PORT ${PORT}`)
})
