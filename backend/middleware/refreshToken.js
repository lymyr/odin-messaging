import { sign } from "jsonwebtoken"
process.loadEnvFile()
export default function refreshToken(req, res, next) {
    const refreshed = {
        ...req.decodedToken,
        exp: Math.floor(Date.now()/1000) + (60*30)
    }
    const refreshToken = sign(refreshed, process.env.JWT_SECRET)
    req.refreshToken = refreshToken
    next()
}