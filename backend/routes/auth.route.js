import express from "express"
import { signup } from "../controllers/authController";
const router = express.Router();

router.post("/signup", signup);

router.get("/login", (req, res) => {
  res.send("Login Page");
});

router.get("/logout", (req, res) => {
  res.send("Logout Page");
});

export default router;