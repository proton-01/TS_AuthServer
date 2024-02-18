import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { User } from "../models";

dotenv.config();

const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, { password: 0 });
        return res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'error fetching users' })
    }
}

export const privateRouteController = {
    getAllUser
}