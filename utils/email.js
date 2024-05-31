const nodemailer=require('nodemailer');
const sendEmail=async options=>{
    //1.creating transporter
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    //2.mail options what top of emails consists of
    const mailOptions={
        from:'Saikumar <saikumar@new.io>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    //3. sending email
    await transporter.sendMail(mailOptions);
}
module.exports=sendEmail;