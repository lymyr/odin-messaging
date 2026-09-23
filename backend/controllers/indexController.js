import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"


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