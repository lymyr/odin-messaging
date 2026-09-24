import { Router } from "express";
import indexRouter from "../v1_routes/indexRouter.js";
import messageRouter from "../v1_routes/messageRouter.js";

const v1 = Router()

v1.use("/", indexRouter)
v1.use("/messages", messageRouter)

export default v1