import { prisma } from "../../lib/prisma.js";
import app from "../../app.js";
import request from "supertest"
import jwt from "jsonwebtoken"

const userList = [
    {
        id: "goku",
        name: "Son Goku",
        password: "dragon ballz"
    },
    {
        id: "gohan",
        name: "great saiyaman",
        password: "dragon ballz"
    },
    {
        id: "satoru",
        name: "da satoru gojo",
        password: "one piz"
    },
    {
        id: "vegeta",
        name: "super duper saiyan",
        password: "dragon ballz"
    },
    {
        id: "zoro",
        name: "greatest swordsman",
        password: "one piz"
    },
]

beforeAll(async () => {
    await prisma.user.createMany({
        data: userList
    })
    jest.spyOn(jwt, "verify").mockReturnValue({
        ...userList[0],
        iat: 5,
        exp: 6
    })
    jest.spyOn(jwt, "sign").mockReturnValue("token")
})

afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
})

describe("/users", () => {
    test("return users", async () => {
        const res = await request(app)
            .get("/v1/users")
            .set("authorization", "bearer token")

        expect(res.body.data).toEqual({
            token: "token",
            users: expect.arrayContaining(userList.map(user => {
                return {id: user.id, name: user.name}
            }))
        })
    })

    test("return users by query", async () => {
        const res = await request(app)
            .get("/v1/users?search=go")
            .set("authorization", "bearer token")

        expect(res.body.data).toEqual({
            token: "token",
            users: expect.not.arrayContaining(
                    userList.map(user => {
                    return {id: user.id, name: user.name}
                }).slice(3)
            )
        })
    })
})