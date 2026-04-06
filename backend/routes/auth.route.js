import express from "express"
import { signup, login, logout, updateProfile } from "../controllers/authController.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { arcjectProtection } from "../middlewares/arcjet.middleware.js";
const router = express.Router();

router.post("/signup",arcjectProtection , signup);

router.post("/login", arcjectProtection ,login);

router.post("/logout",arcjectProtection, logout);

router.put("/update-profile",arcjectProtection ,  protectRoute, updateProfile);

router.get("/check",arcjectProtection , protectRoute, (req,res) => res.status(200).json(req.user));

export default router;