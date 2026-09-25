import { Router } from "express";
import { getChats, getMessages, retrieveMessagesByUserId, sendMessage, sendMessageByUserId } from "../controllers/chatController.js";
import { isValidJwt } from "../middleware/isValidJwt.js";
import { ChatValidation, MessageValidation, throwerHelper, UserValidation } from "../middleware/validation.js";
import refreshToken from "../middleware/refreshToken.js";

const chatRouter = Router()

chatRouter.use(isValidJwt, refreshToken)

chatRouter.get("/", getChats)

// routes for when user uses search bar
chatRouter.post("/user/:userId", 
    MessageValidation.message,
    UserValidation.id,
    throwerHelper,
    sendMessageByUserId
)

chatRouter.get("/user/:userId", 
    UserValidation.id,
    throwerHelper,
    retrieveMessagesByUserId
)

// routes for main chat menu where it shows all available chats
chatRouter.use("/:chatId",
    ChatValidation.isParticipant,
    throwerHelper,
)

chatRouter.get("/:chatId", getMessages)

chatRouter.post("/:chatId", 
    MessageValidation.message,
    throwerHelper,
    sendMessage
)

export default chatRouter