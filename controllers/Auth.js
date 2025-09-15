import users from "../model/Auth.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authToken  } from "../config/constant.js";
import { transporter } from "../config/nodemailer.js";


export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({success: false, message: "Email or password is required."});
    }

    try{
        const checkUser = await users.findOne({where: {email}});
        if(!checkUser){
           return res.status(400).json({success: false, message: "Email doesn't exist."})
        }
        const checkPass = await bcrypt.compare(password, checkUser.password);
        // const checkPass = password === checkUser.password
        if(!checkPass){
            return res.status(400).json({success: false, message: "Wrong password."});
        }
        const token = jwt.sign({email : checkUser.email}, authToken, {expiresIn : "10min"});
        console.log(token);
        if(!token){
            res.status(403).json({success: false, message: "Unauthorised access."});
        }
 
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp); 
        await users.update({
            otp,
            otpExpiry: new Date(Date.now() + 2 * 60 * 1000), 
        },
        { 
            where: { email: checkUser.email }
        });
        try{
            const sendOtp = await transporter.sendMail({
                from: "testing@genvwebsters.com",
                to: email,
                subject: "Verify your email address",
                html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8f9fa; padding: 30px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);"> 
            <div style="background-color: #2c3e50; padding: 40px 30px; text-align: center;">
                <h1 style="font-size: 28px; font-weight: 600; color: #ffffff; margin: 0; letter-spacing: -0.5px;">GenV Websters</h1>
            </div>
        
            <div style="padding: 50px 30px; align-items: center; text-align: center;">
                <h2 style="font-size: 24px; font-weight: 600; color: #2c3e50; margin-bottom: 20px;">Hello ${checkUser.firstName} ${checkUser.lastName},</h2>
                
                <p style="font-size: 16px; color: #666666; margin-bottom: 40px; line-height: 1.6;">
                     Please use the verification code below to complete your authentication.
                </p>
            
                <div>
                    <div style="font-size: 14px; font-weight: 500; color: #666666; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</div>
                    <div style="font-size: 36px; font-weight: 700; color: #2c3e50; letter-spacing: 6px; margin-bottom: 16px; font-family: 'Courier New', monospace;">${otp}</div>
                    <div style="font-size: 13px; color: #999999; margin-bottom: 5px;">This code will expire in 2 minutes</div>
                </div>

                <div style="padding: 30px; text-align: center;">                
                <p style="font-size: 12px; color: #999999; margin-top: 20px;">
                    © 2025 GenV Websters. All rights reserved.<br>
                </p>
            </div>
            </div>     
        </div>
    </div>`});

            console.log(sendOtp); // have to comment out ts.
        }
        catch(error){
            console.log(error)
        }
            
    } 

        // return res.status(200).json({success: true, message: "User logged in successfully."}) 
    catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Internal Server Error."});
    }
}