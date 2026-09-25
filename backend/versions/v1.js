import { Router } from "express";
import indexRouter from "../v1_routes/indexRouter.js";
import chatRouter from "../v1_routes/chatRouter.js";
import userRouter from "../v1_routes/userRouter.js";

const v1 = Router()

v1.use("/", indexRouter)
v1.use("/chats", chatRouter)
v1.use("/users", userRouter)

export default v1