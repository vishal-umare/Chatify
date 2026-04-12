import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Extract the token from http only cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    // check token exists or not
    if(!token){
        console.log("socket connection rejected: No token provided");
        return next(new Error("Unauthorized- No token provied"));
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        console.log("socket connection rejected: Invalid token");
        return next(new Error("Unauthorized- Invalid token"));
    }   

    // find user from DB
    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        console.log("socket connection rejected: User not found");
        return next(new Error("User not found"));
    } 

    // attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user ${user.fullname} (${user.id})`);

    next();

  } catch (error) {
    console.log("Error in socket authenticaiton", error.message);
    next(new Error("Unauthorized -authentication failed"));
    
  }
};
