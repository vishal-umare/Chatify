import express from "express"
import 'dotenv/config';
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors" ;

import authRouter from "../routes/auth.route.js";
import messagesRoute from "../routes/messages.route.js";
import { connectDB } from "../lib/db.js";

const app = express();
const __dirname = path.resolve();


// middlewares
app.use(express.json());
app.use(cors({ origin:process.env.CLIENT_URL , credentials: true })) ;
app.use(cookieParser());

const PORT = process.env.PORT ;

// Routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRoute);


// make ready for deployment 
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res)=> {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});
