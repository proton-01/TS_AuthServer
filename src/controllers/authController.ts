import { Request, Response } from "express";
import { User } from "../models";
import { generateHash, verifyHash } from "../utils/password.utils";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? '';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? '';
const cookieProperties = {
    path: "/",
    sameSite: false,
    httpOnly: true,
}


/**
 * Registers a new user, hashing their password, and returning access and refresh tokens.
 * @param req - The request object containing user registration data.
 * @param res - The response object to send the HTTP response.
 */
const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            return res.status(400)
                .json({ message: "username or email already exist" });
        }
        const passwordHash = await generateHash(password);
        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });
        await newUser.save();

        const payload = {
            username: newUser.username,
            role: newUser.role,
            userId: newUser._id,
        }
        const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });

        res.cookie('refresh_token', refreshToken, cookieProperties);
        res.cookie('accesss_token', accessToken, cookieProperties);
        return res.status(201).json({
            message: 'User registred successfully',
            accessToken,
            userDetails: payload,
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const existUser = await User.findOne({
            $or: [{ username }, { email }],  // as am checking both email and username ,even if only one matches it will return the user object
        })
        if (existUser) {
            const isPassMatching = await verifyHash(password, existUser.password);

            if (isPassMatching) {
                const payload = {
                    username: existUser.username,
                    role: existUser.role,
                    userId: existUser._id,
                }
                const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '15min' });
                const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });

                res.cookie('access_token', accessToken, cookieProperties);
                res.cookie('refresh_token', refreshToken, cookieProperties);

                return res.status(201).json({
                    message: 'user loged in successful',
                    accessToken,
                    userDetails: payload,
                })
            } else {
                return res.status(401).json({
                    message: 'Invalid credentials'
                })
            }
        } else {
            return res.status(401).json({
                message: 'User is not registred yet , please register first',
            })
        }
    } catch (err) {
        console.log({ err });
        res.status(500).send('Internal server error');
    }
}

export const authController = {
    registerUser,
    loginUser
}