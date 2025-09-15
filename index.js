import express from "express";
import dotenv from "dotenv";
import AuthRouter from "./routes/Auth.js"

const app = express();
app.use(express.json());
dotenv.config();

app.use("/api/auth",AuthRouter);

// app.get("/show-data", async (req, res) => {
//     const showUser = await users.findAll();
//     if(!showUser){
//         return res.status(404).json({success: false, message: "User not found"});
//     }
//     return res.status(200).json({success: true, message: showUser});
// });

app.listen(8080, () => {
    console.log("Server is listening...");
});