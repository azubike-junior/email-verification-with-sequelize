import models from '../models';
import { serverError, httpResponse } from '../helpers/response';
import isEmpty from 'lodash.isempty';
const { User } = models;
import Joi from 'joi'
import { uuidSchema } from '../validationSchema/validateUser';

export const checkUniqueEmail = async (req, res, next) => {
    try {
        const { body: { email } } = req;
        const foundUser = await User.findOne({
            attributes: ["email"],
            where: { email }
        });
        return !isEmpty(foundUser) ? httpResponse(res, {
            statusCode: 409,
            message: "Email has already been used"
        }) : next()
    } catch (e) {
        console.log(e)
        serverError(res, e)
    }
}

export const findUserById = async (req, res, next) => {
    const userId = req.params.userId;
    const validateId = Joi.validate(userId, uuidSchema);
    try {
        if (validateId.error) {
            return httpResponse(res, {
                statusCode: 400,
                success: false,
                message: "Invalid User Id"
            });
        }
        const user = await User.findByPk(userId)
        if (!user) {
            return httpResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not found"
            });
        }
        req.userDetails = user;
        return next()
    } catch (e) {
       return serverError(res, e)
    }
}