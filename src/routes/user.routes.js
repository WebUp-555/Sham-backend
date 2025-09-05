import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";

const router= Router()

router.route("/register").post(registerUser)
router.route("/users").post(registerUser)
export default router;