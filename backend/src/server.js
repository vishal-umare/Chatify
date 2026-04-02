// const express = require("express");
import express from "express"
import 'dotenv/config'
import authRouter from "../routes/auth.route.js";
import messagesRoute from "../routes/messages.route.js";

const app = express();

const PORT = process.env.PORT ;

app.use("/api/auth", authRouter);

app.use("/api/messages", messagesRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
