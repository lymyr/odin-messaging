import { Router } from "express";
import { createAccount, login } from "../controllers/indexController.js";
import { AccountValidation, throwerHelper } from "../middleware/validation.js";

const indexRouter = Router()

indexRouter.post("/register", 
    AccountValidation.accountCreation,
    throwerHelper,
    createAccount
)

indexRouter.post("/login",
    AccountValidation.login,
    throwerHelper,
    login
)

export default indexRouter