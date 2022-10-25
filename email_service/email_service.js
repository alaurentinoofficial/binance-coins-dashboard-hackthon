
import NodeMailer from 'nodemailer';

function initEmailTransport() {
    return NodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "f85789c731bd73",
            pass: "93c2a6271ef32a"
        }
    })
}

export function sendUpdateEmail(receiverAddress, asset, message){
    //Configure Email template based on parameters
    let mailOptions = {
        from: '"Crypto alert" <from@example.com>',
        to: receiverAddress,
        subject: `Updates on ${asset}`,
        text: message
    };
    const sender = initEmailTransport();
    
    sender.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

//export default sendUpdateEmail 
//sendUpdateEmail("joaoguedesmg@gmail.com", "bitcoin", "updated")