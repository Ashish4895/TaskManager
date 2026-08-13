import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { NextFunction, Request, RequestHandler, Response } from "express";


export interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const protectRoute = async (req: AuthenticatedRequest,res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            res.status(401).json({message: "Unauthorized - No Token Provided"});
            return;
        }
        if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        if (!decoded.userId) {
            res.status(401).json({message: "Unauthorized - Invalid Token"});
            return;
        }
        const userId = (decoded as jwt.JwtPayload).userId;
        const user = await User.findById(userId).select("-password");

        if(!user){
            res.status(404).json({message:"User not found"});
            return;
        }

        req.user = user;

        next();

    } catch (error: unknown) {
        if (error instanceof JsonWebTokenError) {
            console.log("Error in protectRoute middleware (JWT Error):", error.message);
        } else {
            console.log("Error in protectRoute middleware", error);
        }
        res.status(500).json({message : "Internal Server Error"});
    }
}