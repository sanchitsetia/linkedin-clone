import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async(req, res) => {
  try {
    const { name, email, password, userName } = req.body;
    if(!name || !email || !password || !userName) {
      return res.status(400).send("All fields are required");
    }
    const existingEmail = await User.findOne({ email });
    if(existingEmail) {
      return res.status(400).send("Email already exists");
    }
  
    const existingUserName = await User.findOne( { userName });
    if(existingUserName) {
      return res.status(400).send("Username already exists");
    }
  
    if(password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long");
    }
  
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = new User({ name, email, password: hash, userName });
    await user.save();
  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{
      expiresIn: "3d",
    });
  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    
    res.status(201).json({message: "user created"});
    const profileUrl = `${process.env.CLIENT_URL}/profile/${user.userName}`;
    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
      
    } catch (emailError) {
      console.log("error in sending welcome email",emailError.message);
    }
    
  } catch (error) {
    console.log("error in signup",error.message);
    res.status(500).send("Internal Server Error");
    
  }

};

export const signin = async (req, res) => { 
  try {
    const { userName, password } = req.body;
    if(!userName || !password) {
      res.status(400).send("All fields are required");
    }
  
    const userFound =await User.findOne({ userName });
    if(!userFound) {
      return res.status(400).send("User not found");
    }
  
    const isPasswordCorrect = await bcrypt.compare(password, userFound.password);
    if(!isPasswordCorrect) {
      return res.status(400).send("Incorrect password");
    }
  
    const token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    })
    await res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({message: "user signed in"});
    
  } catch (error) {
    console.log("error in signin",error.message);
    res.status(500).send("Internal Server Error");
  }

};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({message: "user logged out"});
};

export const getUserDetails = (req, res) => {
  res.status(200).json(req.user);
};