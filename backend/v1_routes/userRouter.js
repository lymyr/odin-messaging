import { Router } from "express";
import { isValidJwt } from "../middleware/isValidJwt.js";
import refreshToken from "../middleware/refreshToken.js";
import { getUser, getUsers } from "../controllers/userController.js";
import { throwerHelper, UserValidation } from "../middleware/validation.js";

const userRouter = Router()
userRouter.use(isValidJwt, refreshToken)

userRouter.get("/", getUsers)
userRouter.get("/:userId", 
    UserValidation.id,
    throwerHelper,
    getUser
)

export default userRouter