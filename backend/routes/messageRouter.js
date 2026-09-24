import { Router } from "express";
import { sendMessage } from "../controllers/messageController.js";
import { isValidJwt } from "../middleware/isValidJwt.js";
import { MessageValidation, throwerHelper, UserValidation } from "../middleware/validation.js";
import refreshToken from "../middleware/refreshToken.js";

const messageRouter = Router()

messageRouter.use(isValidJwt, refreshToken)

messageRouter.post("/:userId", 
    MessageValidation.message,
    UserValidation.id,
    throwerHelper,
    sendMessage
)

export default messageRouter