
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


function createMessage(receiverAddress, subjectText, text){
    return {
        from: '"Crypto alert" <from@example.com>',
        to: receiverAddress,
        subject: subjectText,
        text: message
    }
}

function sendEmail(message){

    const sender = initEmailTransport();
    
    sender.sendMail(message);
}

export function sendGenericUpdateEmail(receiverAddress, asset, messageText){
    //Configure Email template based on parameters
    var subjectText = `Updates on ${asset}`
    var message = createMessage(receiverAddress, subjectText ,messageText);
    sendEmail(message)
}

//TODO: Configure methods to alert asset increase and decrease 
//TODO: Find a way to avoid send more than 10 emails for minute, we only have 500 emails available
// so we need save resources 

//export default sendUpdateEmail 
//sendUpdateEmail("joaoguedesmg@gmail.com", "bitcoin", "updated")