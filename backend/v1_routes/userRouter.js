import { Router } from "express";
import { isValidJwt } from "../middleware/isValidJwt.js";
import refreshToken from "../middleware/refreshToken.js";
import { getUsers } from "../controllers/userController.js";

const userRouter = Router()
userRouter.use(isValidJwt, refreshToken)

userRouter.get("/", getUsers)

export default userRouter