import { signUpSchema, signInSchema, updateProfileSchema, passwordResetSchema } from '../../validationSchema/validateUser';
import { validateData } from '../../validationSchema/validationData';
import { httpResponse } from '../../helpers/response';

export const validateInput = async( req, res, next) => {
    const schemas = {
        '/signup': signUpSchema,
        '/signin': signInSchema,
        '/updateProfile': updateProfileSchema,
        '/resetPassword': passwordResetSchema
    }

    const validation = await validateData(req.body, schemas[`/${req.path.split('/').pop()}`]);

    if (validation.hasError) {
        return httpResponse(res, {
            statusCode: 400,
            errorMessages: validation.errors
        });
    }
    req.body = validation.fields;
    return next()
}