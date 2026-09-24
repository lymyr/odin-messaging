import jwt from "jsonwebtoken"
process.loadEnvFile()
export default function refreshToken(req, res, next) {
    const refreshed = {
        ...req.decodedToken,
        exp: Math.floor(Date.now()/1000) + (60*30)
    }
    const refreshToken = jwt.sign(refreshed, process.env.JWT_SECRET)
    req.refreshToken = refreshToken
    next()
}