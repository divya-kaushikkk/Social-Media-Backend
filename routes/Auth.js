import { Router } from "express";
import {login} from "../controllers/Auth.js";
import { signup } from "../controllers/signup.js";
import { verifyOtp } from "../controllers/verifyOtp.js";

const router = Router();

router.post("/login", login)
router.post("/signup", signup)
router.post("/verify-otp",verifyOtp)

export default router;