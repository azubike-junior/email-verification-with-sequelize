import Mailgen from 'mailgen';

const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'EMAIL VERIFICATION',
        link: '#'
    }
})

const emailTemplate = (firstName, lastName, url, { intro, color, text, outro }) => {
    const email = {
        body: {
            name: `${firstName} ${lastName}`,
            intro,
            action: {
                instructions: 'To get Started, please click here:',
                button: {
                    color, 
                    text,
                    link: url
                }
            },
            outro
        }
    }
    return mailGenerator.generate(email)
}

export default emailTemplate