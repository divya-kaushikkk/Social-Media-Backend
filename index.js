import express from "express";
import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import z, { success } from "zod";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
app.use(express.urlencoded({ extended: true })); 


// first of all, we'll connect to DB

const authToken = process.env.JWT_SECRET;

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
    }
);

// will define the schema

const Users = sequelize.define("Users",{

    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,

    },

    password : {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

await Users.sync();

const values = z.object({
    email: z.email(/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,"Invalid email format."),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
  "Password must be at least 8 chars and include upper, lower, number, special char."),
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({success: false, message: "Email or password is required."});
    }

    try{
        const checkUser = await Users.findOne({where: {email}});

        if(!checkUser){
           return res.status(400).json({success: false, message: "Email doesn't exist."})
        }

        const checkPass = await bcrypt.compare(password, checkUser.password);
        // const checkPass = password === checkUser.password

        console.log(password)
        console.log(checkUser.password);   // doubt hereeeeeeeeeeeeeeeeeeeeeeeeeeeee.
        if(!checkPass){
            return res.status(400).json({success: false, message: "Wrong password."});
        }

        const token = jwt.sign({email : checkUser.email}, authToken, {expiresIn : "10min"});
        console.log(token);
        if(!token){
            res.status(403).json({success: false, message: "Unauthorised access."});
        }
    
        return res.status(200).json({success: true, message: "User logged in successfully.", token});
    } 
    catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Internal Server Error."});
    }
});

app.post("/signup", async (req, res) => {
    try{
        const validateInput = values.safeParse(req.body);
        
        if(!validateInput.success){
            console.log(validateInput.error)
            return res.status(400).json({success: false, error: "Enter valid email or password."})
        }
        

        const checkUser = await Users.findOne({where: {email: validateInput.data.email.toLocaleLowerCase().trim()}});
        if(checkUser){
            return res.status(400).json({success: false, message: "Email already exists."})
        }

        const hashedPassword = await bcrypt.hash(validateInput.data.password, 10);
        await Users.create({email: validateInput.data.email.toLocaleLowerCase().trim(), password: hashedPassword});
        
        return res.status(200).json({success: true, message: "User signed up successfully."})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success: false, message: "Internal Server Error."});
    }

});

app.get("/show-data", async (req, res) => {
    const showUser = await Users.findAll();
    if(!showUser){
        return res.status(404).json({success: false, message: "User not found"});
    }
    return res.status(200).json({success: true, message: showUser});
});

app.listen(8080, () => {
    console.log("Server is listening...");
});