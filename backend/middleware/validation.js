import { body, validationResult } from "express-validator"
import { prisma } from "../lib/prisma.js"

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
    static username = body("username").trim().notEmpty().withMessage("Please provide a username")
        .custom(username => {
            if (username.split("").includes(" "))
                throw new Error("Username must not include spaces")
            return true
        }).bail()
        .customSanitizer(username => username.toLowerCase())
        
    static usernameCreation = this.username.custom(async (username, {req}) => {
        const user = await prisma.user.findMany({ where: {
            id: username
        }})

        if (user.length > 0) {
            req.errorStatusCode = 409
            throw new Error("Username already exists")
        }
    })

    static password = body("password").notEmpty().withMessage("Password must not be empty")
    static confirmPassword = body("confirmPassword").notEmpty().withMessage("Please confirm your password")
        .custom((cPass, {req}) => cPass == req.body.password)

    static displayName = body("displayName").trim().notEmpty().withMessage("Display name must not be empty")

    static accountCreation = [
        this.usernameCreation,
        this.password,
        this.confirmPassword,
        this.displayName
    ]
}