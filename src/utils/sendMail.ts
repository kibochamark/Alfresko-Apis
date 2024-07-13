import { transporter } from "./NodeMailer";



const sendEmail = async (email: string,  token: string) => {
    const mailOptions = {
        from: process.env.EMAIL ?? "kibochamark@gmail.com",
        to:email,
        subject:"Password Reset Token",
        html: `<b>Reset token</b> 
        <p style={{
            display:"flex",
            width:20px,
            flex-wrap:"wrap"
        }}>${token}</p>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail