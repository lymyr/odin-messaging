import { Router } from "express";
import { isValidJwt } from "../middleware/isValidJwt.js";
import refreshToken from "../middleware/refreshToken.js";
import { getUser, getUsers, updateUserDetails } from "../controllers/userController.js";
import { AccountValidation, throwerHelper, UserValidation } from "../middleware/validation.js";

const userRouter = Router()
userRouter.use(isValidJwt, refreshToken)

userRouter.get("/", getUsers)
userRouter.get("/:userId", 
    UserValidation.id,
    throwerHelper,
    getUser
)

userRouter.put("/",
    AccountValidation.displayName,
    AccountValidation.description,
    throwerHelper,
    updateUserDetails
)

export default userRouter