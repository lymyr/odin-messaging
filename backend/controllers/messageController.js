import { prisma } from "../lib/prisma.js"

export const sendMessage = async (req, res) => {
    const message = await prisma.message.create({
        data: {
            text: req.body.message,
            user: {connect: {id: req.decodedToken.id}},
            recipient: {connect: {id: req.params.userId}}
        }
    })

    res.status(201).json({
        data: {
            message,
            token: req.refreshToken
        }
    })
}