import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password length should be more than 6 characters" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter valid email" });
    }

    const user = await User.findOne({email});
    if (user) return res.status(400).json({ message: "This email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullname,
      password: hashedPassword,
    });

    if(newUser){
      // generateToken(newUser._id,res);
      // await newUser.save();

      // Persist user first and then issue cookie
      const savedUser = await newUser.save();
      generateToken(savedUser._id,res);

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })

      try {
        await sendWelcomeEmail(savedUser.email,savedUser.fullname,process.env.CLIENT_URL)
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data"})
    }
    
  } catch (error) {
    console.log("Error in signup controller");
    res.status(500).json({message: "Interval server error"})
  }
};
