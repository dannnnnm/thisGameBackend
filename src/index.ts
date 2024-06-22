import express from "express";
import { createServer } from "http";
import path, { join } from "path";
import {Server} from "socket.io"

const app=express()
const server=createServer(app)
const io=new Server(server)

const port=3000;
const __dirname=path.resolve();


app.get("/hello",(req,res)=>{
    res.send("hell");
})

app.get("/",(req,res)=>{
    res.sendFile(join(__dirname,"index.html"))
})

io.on('connection',(socket)=>{
    console.log("a user connected")
    socket.on('chat message',(message)=>{
        console.log("new message: ",message)
        io.emit('chat message', message);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

server.listen(port,"0.0.0.0",()=>{
    console.log("up and running")
})