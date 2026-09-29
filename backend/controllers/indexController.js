import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import tokenLife from "../helpers/tokenLife.js"
process.loadEnvFile()

export const createAccount = async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, 10)
    await prisma.user.create({
        data: {
            id: req.body.username,
            name: req.body.displayName,
            password: hashed
        }
    })
    res.status(201).send("Account created")
}

export const login = async (req, res) => {
    const user = req.user
    delete user.password
    
    const token = jwt.sign({
        ...user,
        iat: Math.floor(Date.now()/1000),
        exp: tokenLife
    }, process.env.JWT_SECRET)
    
    res.json({data: {token}})
}