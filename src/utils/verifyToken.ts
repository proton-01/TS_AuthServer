import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized user' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.status(401).send({ error: 'Unauthorized' });
        // req.user = user;
        next();
    })
};
