import users from "../model/Auth.js"

export const verifyOtp = async(req, res) => {

    try{
        const {email, otp} = req.body;
        if(!email || !otp){
            return res.status(400).json({success: false, message: "Email or otp is required."})
        }

        const user = await users.findOne({where: {email}});

        if(!user){
            return res.status(400).json({success: false, message: "Email doesn't exist."})
        }

        if (!user.otp || Date.now() > new Date(user.otpExpiry)) {
             return res.status(400).json({ success: false, message: "OTP is expired." });
        }
        
        console.log(otp.toString() === user.otp.toString())
       

         if(otp.toString() === user.otp.toString()){
            console.log(otp === user.otp)
            return res.status(200).json({success: true, message: "Correct otp."})
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Internal Server Error."})
    }

}