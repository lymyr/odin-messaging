import { Router } from "express";
import { createAccount } from "../controllers/indexController.js";
import { AccountValidation, throwerHelper } from "../middleware/validation.js";

const indexRouter = Router()

indexRouter.post("/", 
    AccountValidation.accountCreation,
    throwerHelper,
    createAccount
)

export default indexRouter