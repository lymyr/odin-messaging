import express from "express";
import cors from "cors"
import indexRouter from "./routes/indexRouter.js";

process.loadEnvFile()

const app = express()

const corsOptions = process.env.NODE_ENV != "test" && process.env.NODE_ENV != "dev" ? 
    { origin: process.env.ORIGINS.split(",") } :
    { origin: "*" }
app.use(cors(corsOptions))

app.use(express.json())

if ( process.env.NODE_ENV != "test" ) {
    app.listen(process.env.PORT, () => {
        console.log("Listening to " + process.env.PORT)
    })
}

app.use("/", indexRouter)

export default app