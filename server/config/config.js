require('dotenv').config()

const {
  DEV_DATABASE,
  EXPIRY_TIME,
  isProd
} = process.env

module.exports = {
  development: {
    url: DEV_DATABASE
  }
}

export const ISPROD = isProd

export const expiryTime = EXPIRY_TIME