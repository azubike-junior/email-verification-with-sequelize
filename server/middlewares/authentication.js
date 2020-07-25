import dotenv from 'dotenv';
import { serverError, httpResponse } from '../helpers/response';
dotenv.config();
import {decodedJwt} from '../helpers/jwt'

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (typeof token === undefined || !token) {
         return httpResponse(res, {
             statusCode: 401,
             message: "No valid token provided"
         });
    }
    try {
        const decodedToken = decodedJwt(token)
        req.user = decodedToken;
        return next()
    } catch (e) {
        serverError(e)
    }
}