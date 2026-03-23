import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async(otp, email) => {

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
        subject: "Password reset OTP",
        html:`<p>Your OTP for password reset is:<b>${otp}</p>`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log("Error Occurs:", err);
        } else {
            console.log("OTP sent successfully");
        }
    });
};