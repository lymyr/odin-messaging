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

export const retrieveMessages = async (req, res) => {
    /* 
        prob best to add pagination but eh~ i dont find
        this proj to be interesting enough to put in the
        effort T-T
    */
   const messages = await prisma.message.findMany({
        where: {
            userId: req.decodedToken.id,
            recipientId: req.params.userId
        },
        orderBy: {
            dateAdded: "desc"
        }
   })

   res.json({
        data: {
            messages
        }
   })
}