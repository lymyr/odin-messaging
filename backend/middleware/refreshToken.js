import jwt from "jsonwebtoken"
import tokenLife from "../helpers/tokenLife.js"
process.loadEnvFile()

export default function refreshToken(req, res, next) {
    const refreshed = {
        ...req.decodedToken,
        exp: tokenLife()
    }
    const refreshToken = jwt.sign(refreshed, process.env.JWT_SECRET)
    req.refreshToken = refreshToken
    next()
}