import { transporter } from "./NodeMailer";

const sendEmail = async (email: string, token: string) => {
    const logoUrl = 'https://path/logo.png'; // Replace with your logo 

    const mailOptions = {
        from: process.env.EMAIL ?? "kibochamark@gmail.com",
        to: email,
        subject: "Password Reset Token",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px; margin-bottom: 20px;">
                <h3>Password Reset Token</h3>
                <p>Your password reset token is:</p>
                <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${token}</p>
                <p>Please use this token to reset your password.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


export const sendQuoteNotification = async (adminEmail: string, quoteDetails: any) => {
    // console.log(quoteDetails, "qty")
    const logoUrl = 'https://path/logo.png'; // Replace with your logo 
    const { name, email, phone, dimensions, price, canopyType, rooffeature, additionalfeatures, budget, wallfeatures } = quoteDetails;

    const wallFeaturesList = wallfeatures.map(
        (feature: { name: string; description: string }) => `<li><strong>${feature.name}:</strong> ${feature.description}</li>`
    ).join("");

    const mailOptions = {
        from: process.env.EMAIL ?? "kibochamark@gmail.com",
        to: adminEmail,
        subject: "New Quote Created",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px; margin-bottom: 20px;">
                <h2>New Quote Created</h2>
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Dimensions:</strong> ${dimensions}</p>
                <p><strong>Canopy Type:</strong> ${canopyType}</p>
                <p><strong>Roof Material:</strong> ${rooffeature}</p>
                <p><strong>Additional Features:</strong> ${additionalfeatures}</p>
                <p><strong>Budget:</strong> GBP ${budget}</p>
                <p><strong>Estimated Price:</strong> UGX ${price}</p>
                <h3>Wall Features:</h3>
                <ul>${wallFeaturesList}</ul>
                <p>For further details, please check the admin portal.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


export const sendQuoteNotificationToClient = async (adminEmail: string, quoteDetails: any) => {
    // console.log(quoteDetails, "qty")
    const logoUrl = 'https://path/logo.png'; // Replace with your logo 
    const { name, email, phone, dimensions, price, canopyType, rooffeature, additionalfeatures, budget, wallfeatures } = quoteDetails;

    const wallFeaturesList = wallfeatures.map(
        (feature: { name: string; description: string }) => `<li><strong>${feature.name}:</strong> ${feature.description}</li>`
    ).join("");

    const mailOptions = {
        from: process.env.EMAIL ?? "kibochamark@gmail.com",
        to: adminEmail,
        subject: "New Quote Created",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px; margin-bottom: 20px;">
                <h2>New Quote Created</h2>
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Dimensions:</strong> ${dimensions}</p>
                <p><strong>Canopy Type:</strong> ${canopyType}</p>
                <p><strong>Roof Material:</strong> ${rooffeature}</p>
                <p><strong>Additional Features:</strong> ${additionalfeatures}</p>
                <p><strong>Budget:</strong> GBP ${budget}</p>
                <p><strong>Estimated Price:</strong> UGX ${price}</p>
                <h3>Wall Features:</h3>
                <ul>${wallFeaturesList}</ul>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
