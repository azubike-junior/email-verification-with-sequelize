import models from '../models'
import {
    comparePassword
} from '../helpers/password';
import {
    httpResponse,
    userResponse,
    userProfileResponse,
    serverError
} from '../helpers/response';
import {
    generateToken,
    decodedJwt
} from '../helpers/jwt';
import {
    sanitize,
    getBaseUrl
} from '../helpers/user';

const {
    User
} = models

export default class UserController {
    static async userLogin(req, res) {
        const {
            body: {
                email,
                password
            }
        } = req;
        try {
            const user = await User.findOne({
                where: {
                    email
                }
            })
            if (user) {
                if (user.dataValues.isVerified === true) {
                    const userPassword = user.get('password')
                    const isMatch = comparePassword(password, userPassword)
                    if (!isMatch) {
                        return httpResponse(res, {
                            success: false,
                            message: 'invalid Login credentials',
                            statusCode: 401
                        })
                    }
                    const token = generateToken(user.get('userId'))
                    return httpResponse(res, {
                        success: true,
                        message: 'login success',
                        statusCode: 200,
                        data: token
                    })
                }
                return httpResponse(res, {
                    success: false,
                    message: 'invalid login credentials',
                    statusCode: 401,
                })
            }
            return httpResponse(res, {
                success: false,
                message: 'invalid Login credentials',
                statusCode: 401
            })
        } catch (e) {
            console.log(e)
            return serverError(res, e)
        }
    }

    static async signUpUser(req, res) {
        const {
            body: {
                firstName,
                lastName,
                email
            }
        } = req;
        try {
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password: req.body.password
            })
            const {
                password,
                ...user
            } = newUser.dataValues;
            const token = generateToken(user.userId);
            newUser.sendVerificationEmail(`${getBaseUrl(req)}/auth/verification/${token}`)

            const message = `Sign up was successful. Please check your email to activate your account!
            If you don't find it in your inbox, please check your spam messages.`;
            return httpResponse(res, {
                statusCode: 201,
                success: true,
                message: sanitize(message, false).replace("\n", ""),
                user
            })

        } catch (e) {
            console.log(e)
            return serverError(res, e)
        }
    }

    static async verifyUserAccount(req, res) {
        const {
            params: {
                token
            }
        } = req;
        try {
            const decoded = decodedJwt(token);
            let foundUser = await User.findByPk(decoded.userId);
            if (foundUser) {
                if (foundUser.get('isVerified')) {
                    return httpResponse(res, {
                        statusCode: 200,
                        message: 'Account has been verified'
                    })
                }
                return httpResponse(res, {
                    message: 'Account verification was successful',
                    user: userResponse(await foundUser.activateAccount())
                })
            }
            return httpResponse(res, {
                message: 'Sorry, user doesnot exist',
                statusCode: 404
            })
        } catch (e) {
            console.log(e)
            return serverError(res, e)
        }
    }

    static async resetPassword(req, res) {
        const {
            body: {
                password
            }
        } = req;
        const {
            params: {
                token
            }
        } = req;
        try {
            const foundUser = await User.findOne({
                where: {
                    resetToken: token
                }
            });
            console.log('====foundUser', foundUser)
            if (foundUser) {
                console.log('======= it got here')
                await foundUser.resetPassword(password, token);
                return httpResponse(res, {
                    statusCode: 200,
                    success: true,
                    message: "Password changed Successfully",
                    data: userResponse(foundUser)
                });
            }
            return httpResponse(res, {
                statusCode: 400,
                message: "Password Reset Failed, try again"
            });
        } catch (e) {
            console.log(e)
            return serverError(res, e)
        }
    }

    static async passwordResetRequest(req, res) {
        const {
            email
        } = req.body
        try {
            const verifiedUser = await User.findOne({
                where: {
                    email,
                    isVerified: true
                }
            })
            if (verifiedUser) {
                const url = `${getBaseUrl(req)}/user/resetPassword`;
                console.log(url)
                await verifiedUser.sendPasswordResetEmail(url)
                return httpResponse(res, {
                    success: true,
                    statusCode: 200,
                    message: `Password Reset Email has been Sent Successfully to your email, `.concat(
                        "check your Spam in case you did not find it in your inbox"
                    ),
                    data: await verifiedUser.generateResetToken()
                });
            }
            return httpResponse(res, {
                success: false,
                statusCode: 404,
                message: "Invalid Email or You are not verified"
            });

        } catch (e) {
            return serverError(res, e)
        }
    }

    static async getUserProfile(req, res) {
        const {
            userDetails
        } = req;
        try {
            return httpResponse(res, {
                statusCode: 200,
                success: true,
                message: 'User profile retrieved',
                data: userResponse(userDetails)
            })
        } catch (e) {
            console.log(e)
            return serverError(res, e);
        }

    }

    static async updateUserProfile(req, res) {
        const {
            user,
            userDetails
        } = req;
        try {
            const userId = user.userId;
            if (userId === userDetails.userId) {
                const updatedUserProfile = await userDetails.updateProfile(req.body);
                console.log(updatedUserProfile)
                return httpResponse(res, {
                    statusCode: 200,
                    success: true,
                    message: "User profile updated",
                    data: userProfileResponse(updatedUserProfile)
                });
            }
            return httpResponse(res, {
                statusCode: 401,
                success: false,
                message: "Unauthorized, Can not update another user's profile"
            });
        } catch (e) {
            console.log(e)
            return serverError(res, e)
        }
    }
}