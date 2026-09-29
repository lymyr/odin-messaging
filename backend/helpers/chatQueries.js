import { prisma } from "../lib/prisma.js";

export async function getChat(participants) {
    const chat = await prisma.chat.findFirst({
        where: {
            participants: {
                every: {
                    userId: {
                        in: participants
                    }
                }
            }
        }
    })
    return chat
}

// can cause chat duplication if handled incorrectly
// todo..?: find a way to fix that from ever happening
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