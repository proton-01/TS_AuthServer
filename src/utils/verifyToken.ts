import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? '';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? '';

// export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

//     const authHeader = req.headers['authorization'];
//     const token = authHeader?.split(" ")[1];
//     if (!token) return res.status(401).send({ error: 'Unauthorized user' });
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
//         if (err) return res.status(401).send({ error: 'Unauthorized' });
//         // req.user = user;
//         next();
//     })
// };

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    let accessToken = authHeader?.split(" ")[1];
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
        return res.status(401).send('Access denied! No refresh token provided.');
    }
    if (!accessToken) {
        // return res.status(401).send({ error: 'Unauthorized user' });
        const decoded = jwt.verify(refreshToken, refreshTokenSecret);
        accessToken = jwt.sign({ userId: (decoded as JwtPayload).userId }, accessTokenSecret);
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.status(401).send({ error: 'Unauthorized' });
        // req.user = user;
        next();
    })
};
