import { prisma } from "../lib/prisma.js"

export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        take: 20,
        select: {
            id: true,
            name: true
        },
        where: {
            OR: [
                {id: {contains: req.query.search ? req.query.search : ""}},
                {name: {contains: req.query.search ? req.query.search : ""}},
            ]
        }
    })

    res.json({
        data: {
            users,
            token: req.refreshToken
        }
    })
}