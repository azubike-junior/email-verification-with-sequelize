import isEmpty from 'lodash.isempty';
import sgMail from '@sendgrid/mail';
import emailTemplate from './emailgenerator';
import dotenv from 'dotenv';
dotenv.config()

const {SG_KEY, EMAIL} = process.env

sgMail.setApiKey(SG_KEY);

export const sendEmail = async (firstName, lastName, userEmail, subject, url, constants) => {
    if (isEmpty(userEmail)) {
        throw new Error('Email is invalid')
    }
    const emailBody = {
        to: userEmail,
        from: EMAIL,
        subject,
        html: emailTemplate(firstName, lastName, url, constants)
    };
    const mail = await sgMail.send(emailBody);
    return mail
}