import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const app = express();

const server = http.createServer(app);

const io = new Server( server, {
    cors:{
        origin: process.env.CLIENT_URL,
        credentials: true ,
    }
});

io.use(socketAuthMiddleware);

// this is for storing online users
const userSocketMap = {}; 

io.on("connection", (socket) =>{
    console.log("A user connected", socket.user.fullname);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // with socket.on we listen for events from clients
    socket.on("disconnected", ()=>{
        console.log("A user disconnected", socket.user.fullname);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

export { io, app, server } ;