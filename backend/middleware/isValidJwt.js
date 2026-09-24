import { verify } from "jsonwebtoken"

process.loadEnvFile()

export function isValidJwt(req, res, next) {
    try {
        const decodedToken = verify(req.body.token, process.env.JWT_SECRET)
        req.decodedToken = {
            ...decodedToken, 
            exp: Math.floor(Date.now()/1000) + (60*30)
        }

        next()
    }
    catch(e) {
        res.status(400).json({errors: {token: e}})
    }
}