import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = (token, email) => {

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailDetails = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Verify your email",
        text: `Click this link to verify your email:http://localhost:8000/verify-email/${token}`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log("Error Occurs:", err);
        } else {
            console.log("Email sent successfully");
        }
    });
};