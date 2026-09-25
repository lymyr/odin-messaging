import { getChat, createChat } from "../helpers/chatQueries.js"
import { prisma } from "../lib/prisma.js"

export const getChats = async (req, res) => {
    const chats = await prisma.chat.findMany({
        where: {
            participants: {
                some: {
                    userId: req.decodedToken.id
                }
            }
        },
        include: {
            participants: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            messages: {
                take: 1,
                select: {
                    text: true,
                },
                orderBy: {
                    dateAdded: "desc"
                }
            }
        }
    })

    res.json({
        data: {
            chats,
            token: req.refreshToken
        }
    })
}

export const getMessages = async (req, res) => {
    const messages = await prisma.message.findMany({
        where: {
            chatId: req.chat.id
        }
    })
    res.json({
        data: { 
            messages,
            token: req.refreshToken
        }
    })
}

export const sendMessage = async (req, res) => {
    const message = await prisma.message.create({
        data: {
            userId: req.decodedToken.id,
            text: req.body.message,
            chatId: req.chat.id
        }
    })
    res.status(201).json({
        data: { 
            message,
            token: req.refreshToken
        }
    })
}

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
            messages,
            token: req.refreshToken
        }
   })
}