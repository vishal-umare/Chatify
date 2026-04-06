import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt ;
        if(!token) return res.status(401).json( {message:"Unauthorized- token doesn't exists"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json( {message:"Unauthorized- Invalid token"});

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json( {message:"User not exist"});

        req.user = user ;
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware");
        res.status(500).json( {message:"Internal server error"});
    }
}   