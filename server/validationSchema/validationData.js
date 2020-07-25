import Joi from 'joi';

export const validateData = async (inputBody, schema) => {
    try {
        const fields = await Joi.validate(inputBody, schema)
        return {
            hasError: false,
            fields
        }
    } catch ({details}) {
        console.log('======details', details)
        const errors = {};
        details.forEach(err => {
            errors[err.path[0]] = errors[err.path[0]] || err.message.replace(/"/g, "")
        });
        console.log(errors)
        return {
            hasError: true,
            errors
        }
    }
}