import { Router } from "express";
import { retrieveMessagesByUserId, sendMessageByUserId } from "../controllers/chatController.js";
import { isValidJwt } from "../middleware/isValidJwt.js";
import { MessageValidation, throwerHelper, UserValidation } from "../middleware/validation.js";
import refreshToken from "../middleware/refreshToken.js";

const messageRouter = Router()

messageRouter.use(isValidJwt, refreshToken)


// routes for when user uses search bar
messageRouter.post("/user/:userId", 
    MessageValidation.message,
    UserValidation.id,
    throwerHelper,
    sendMessageByUserId
)

messageRouter.get("/user/:userId", 
    UserValidation.id,
    throwerHelper,
    retrieveMessagesByUserId
)

export default messageRouter