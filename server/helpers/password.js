import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const comparePassword = (password, dbPassword) => {
    return bcrypt.compareSync(password, dbPassword)
}