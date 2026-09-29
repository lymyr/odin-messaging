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

export const getUser = (req, res) => {
    delete req.user.password
    res.json({
        data: {
            user: req.user,
            token: req.refreshToken
        }
    })
}

export const updateUserDetails = async (req, res) => {
    const user = await prisma.user.update({
        where: {
            id: req.decodedToken.id
        },
        data: {
            name: req.body.displayName,
            description: req.body.description
        }
    })
    delete user.password

    res.json({
        data: {
            token: req.refreshToken,
            user
        }
    })
}