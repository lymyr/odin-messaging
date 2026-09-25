import jwt from "jsonwebtoken"

process.loadEnvFile()

export function isValidJwt(req, res, next) {
    try {
        const decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
        req.decodedToken = {
            ...decodedToken, 
            exp: Math.floor(Date.now()/1000) + (60*30)
        }

        next()
    }
    catch(e) {
        res.status(401).json({errors: {token: e}})
    }
}