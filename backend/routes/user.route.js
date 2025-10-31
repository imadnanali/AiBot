import express from "express"
import { currUser, logIn, signUp } from "../controller/auth.controller.js";
import isAuthenticate from "../middleware/Autorization.middleware.js";

const router = express.Router();

router.post("/signup", signUp)
router.post("/login", logIn)

router.get("/home", isAuthenticate, currUser)

export default router;