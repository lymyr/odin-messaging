import { getChat, createChat } from "../helpers/chatQueries.js"
import { prisma } from "../lib/prisma.js"

export const sendMessageByUserId = async (req, res) => {
    let chat = await getChat([req.decodedToken.id, req.params.userId])
    if (!chat)
        chat = await createChat([req.decodedToken.id, req.params.userId])
    const message = await prisma.message.create({
        data: {
            text: req.body.message,
            userId: req.decodedToken.id,
            chatId: chat.id
        }
    })

    res.status(201).json({
        data: {
            message,
            token: req.refreshToken
        }
    })
}

export const retrieveMessagesByUserId = async (req, res) => {
   const messages = await prisma.message.findMany({
        where: {
            chat: {
                participants: {
                    every: {
                        AND: [
                            {userId: req.decodedToken.id},
                            {userId: req.params.userId},
                        ]
                    }
                }
            }
        }
   })

   res.json({
        data: {
            messages
        }
   })
}