import { Request, RequestHandler, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils";
import { Console, log } from "console";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import cloudinary from "../lib/cloudinary";

export const signup: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            res.status(400).json({message: "All fields are required"});
            return;
        }
        if(password.length < 6){
            res.status(400).json({message: "Password must be atleast 6  characters"});
            return;
        }
        
        const user = await User.findOne({email});
        if(user) {
            res.status(400).json({message: "Email already exists"});
            return;
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateToken(newUser.id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message : "Invalid user data"});
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("Error in signup controller", error.message);
        } else {
            console.log("Error in signup controller", error);
        }
        res.status(500).json({message : "Internal Server Error"});
    }
};

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;
    try {
        if(!email || !password){
            res.status(400).json({message: "All fields are required"});
            return;
        }
        const user = await User.findOne({email});

        if(!user){
            res.status(400).json({message: "Invalid credentials"});
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            res.status(400).json({message: "Invalid credentials"});
            return;
        }
        generateToken(user.id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error: unknown) {
        if(error instanceof Error){
            console.log("Error in login controller", error.message);
        }else {
            console.log("Error in login controller", error);
        }
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("jwt","", {maxAge: 0});
        res.status(200).json({messasge: "Logged out successfully"});
    } catch (error: unknown) {
        if(error instanceof Error){
            console.log("Error in logout controller", error.message);
        }else {
            console.log("Error in logout controller", error);
        }
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const updateProfile: RequestHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const {profilePic} = req.body;
        const userId = req.user?._id;

        if(!profilePic){
            res.status(400).json({message: "Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in update profile: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};