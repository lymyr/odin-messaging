import { body, param, validationResult } from "express-validator"
import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"

export function throwerHelper(req, res, next) {
    const errorStatusCode = req.errorStatusCode ? req.errorStatusCode : 400
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(errorStatusCode).json({ errors: {...errors.mapped()}})
    next()
}

class Validation {
    constructor() {
        throw new Error("new instance not allowed")
    }
}

export class AccountValidation extends Validation {
    static username = () => body("username").trim().notEmpty().withMessage("Please provide a username")
        .custom(username => {
            if (username.split("").includes(" "))
                throw new Error("Username must not include spaces")
            return true
        }).bail()
        .customSanitizer(username => username.toLowerCase())
        
    static usernameCreation = this.username().custom(async (username, {req}) => {
        const user = await prisma.user.findMany({ where: {
            id: username
        }})

        if (user.length > 0) {
            req.errorStatusCode = 409
            throw new Error("Username already exists")
        }
    })

    static usernameExists = this.username().custom(async (username, {req}) => {
        const user = await prisma.user.findFirst({ where: {
            id: username
        }})

        if (!user) {
            req.errorStatusCode = 404
            throw new Error("User doesn't exist. Please register first")
        }
        req.user = user
    })

    static password = () => body("password").notEmpty().withMessage("Password must not be empty")
    
    static passwordLogin = this.password().bail()
        .custom( async (password, {req}) => {
            if (req.user) {
                const match = await bcrypt.compare(password, req.user.password)
                if (!match)
                    throw new Error("Invalid password")
            }
        })

    static confirmPassword = body("confirmPassword").notEmpty().withMessage("Please confirm your password")
        .custom((cPass, {req}) => cPass == req.body.password)

    
    static displayName = body("displayName").trim().notEmpty().withMessage("Display name must not be empty")

    static accountCreation = [
        this.usernameCreation,
        this.password(),
        this.confirmPassword,
        this.displayName
    ]

    static login = [
        this.usernameExists,
        this.passwordLogin
    ]
}

export class MessageValidation extends Validation {
    static message = body("message").trim().notEmpty()
        .withMessage("Message shouldn't be empty")
        .isLength({max: 255}).withMessage("Message should not exceed 255 characters")
}

export class UserValidation extends Validation {
    static id = param("userId").exists().withMessage("Please add a userId").bail()
        .toLowerCase()
        .custom(async (id, {req}) => {
            const user = await prisma.user.findFirst({ where: { id }})
            if (!user) {
                req.errorStatusCode = 404
                throw new Error("User not found")
            } 
            req.user = user
        })
}


export class ChatValidation extends Validation {
    static id = () => param("chatId").exists().withMessage("Please add a chatId")
        .isInt().withMessage("chatId must be an integer").bail()
        .toInt()
    
    static isParticipant = this.id().custom(async (id, {req}) => {
        const chat = await prisma.chat.findFirst({
            where: { id },
            include: {
                participants: {
                    select: {
                        userId: true
                    }
                }
            }
        })

        let isAuth = false
        for (const p of chat.participants) {
            if (p.userId == req.decodedToken.id) {
                isAuth = true
                break
            }
        }

        if (!isAuth) {
            req.errorStatusCode = 403
            throw new Error("You are not allowed to snoop in other people's chat >:(")
        }
        req.chat = chat
    })
}