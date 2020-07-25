import {
    generateToken
} from "./jwt";
import {
    ISPROD
} from "../config/config";

export const httpResponse = (res, options) => {
    let {
        message,
        success,
        statusCode,
        ...data
    } = options;

    statusCode = statusCode || 200;

    return res.status(statusCode).json({
        message,
        success,
        data
    });
}

export const serverError = (res, error) => {
    return res.status(error.status || 500).json({
        success: false,
        message: ISPROD ? 'Sorry, internal error occured, try again later!' : error.message
    })
}

export const userResponse = (datavalues) => {
    const {
        userId,
        email
    } = datavalues
    return {
        userId,
        email,
        token: generateToken(datavalues.userId)
    }
}

export const userProfileResponse = ({
    dataValues: userId, firstName, lastName, email
}) => {
    return {
        userId,
        firstName,
        lastName,
        email
    }
}