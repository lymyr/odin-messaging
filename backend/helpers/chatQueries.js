import { prisma } from "../lib/prisma.js";

export async function getChat(participants) {
    const chat = await prisma.chat.findFirst({
        where: {
            participants: {
                every: {
                    AND: participants.map(participant => {
                        return {userId: participant}
                    })
                }
            }
        }
    })
    
    return chat
}

export async function createChat(participants) {
    const chat = await prisma.chat.create({
        data: {
            participants: {
                create: participants.map(participant => {
                    return {userId: participant}
                })
            }
        }
    })
    return chat
}