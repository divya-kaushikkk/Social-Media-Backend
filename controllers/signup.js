import users from "../model/Auth.js"
import bcrypt from "bcrypt";
import values from "../validations.js"


export const signup = async (req, res) => {
    try{
       const { firstName, lastName, email, password } = req.body; // ✅ add this line

        const validateInput = values.safeParse(req.body);
        
        if(!validateInput.success){
            console.log(validateInput.error)
            return res.status(400).json({success: false, error: "Enter valid email or password."})
        }
        

        const checkUser = await users.findOne({where: {email: validateInput.data.email.toLocaleLowerCase().trim()}});
        if(checkUser){
            return res.status(400).json({success: false, message: "Email already exists."})
        }

        const hashedPassword = await bcrypt.hash(validateInput.data.password, 10);
        await users.create({firstName: firstName.trim(),lastName:lastName.trim(),email: validateInput.data.email.toLocaleLowerCase().trim(), password: hashedPassword});  

        return res.status(200).json({success: true, message: "User signed up successfully."})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success: false, message: "Internal Server Error."});
    }

}