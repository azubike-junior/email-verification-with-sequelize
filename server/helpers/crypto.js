import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const {
    JWT_SECRET
} = process.env

export const encryptToken = () => {
    const timeEncoded = crypto.createCipher(
        'aes-128-cbc',
        JWT_SECRET
    );
    const timeIssued = new Date();
    let encodedStamp = timeEncoded.update(
        timeIssued.toString(),
        'utf8',
        'hex'
    );
    encodedStamp += timeEncoded.final('hex');
    return encodedStamp;
}

export const decryptToken = token => {
    const timeDecoded = crypto.createDecipher(
        'aes-128-cbc',
        JWT_SECRET
    );
    let decodedStamp = timeDecoded.update(
        token, 'hex', 'utf8'
    );
    return decodedStamp
}

export const getTimeDifference = time => {
    const timeIssued = new Date(time);
    const presentTime = new Date()
    const timeDifference = presentTime.getTime() - timeIssued.getTime();
    return timeDifference / 1000;
}