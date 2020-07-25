import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
const {
    JWT_SECRET
} = process.env

export const generateToken = (userId) => {
    return jwt.sign({
        userId
    }, JWT_SECRET)
}

export const decodedJwt = (token) => {
    return jwt.verify(token, JWT_SECRET);
}