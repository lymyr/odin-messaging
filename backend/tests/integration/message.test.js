import {prisma} from "../../lib/prisma.js"
import jwt from "jsonwebtoken"
import app from "../../app.js"
import request from "supertest"

const messenger = {
    id: "goku",
    name: "Son Goku",
    password: "dragon ballz"
}
const receiver = {
    id: "saiyanprince",
    name: "Vegeta",
    password: "dragon ballz"
}

beforeAll(async () => {
    await prisma.user.createMany({
        data: [
            messenger,
            receiver
        ]
    })
})

afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
})

describe("/messages/:userId", () => {
    jest.spyOn(jwt, "verify")
        .mockImplementationOnce(() => {
            throw new Error()
        })
        .mockImplementationOnce(() => {
            throw new Error()
        })
        .mockReturnValue({
            ...messenger,
            iat: 420,
            exp: 467
        })

    jest.spyOn(jwt, "sign").mockReturnValue("token")


    test("malicious user sending message", async () => {
        const message = "meet me @ bulma's crib"
        const res = await request(app)
            .post(`/messages/${receiver.id}`)
            .set("Authorization", "bearer token")
            .send({ message })

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
            errors: expect.anything()
        })
    })

    test("malicious retrieve messages", async () => {
        const res = await request(app)
            .get(`/messages/${receiver.id}`)
            .set("Authorization", "bearer token")
        
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
            errors: expect.anything()
        })
    })

    test("send message", async () => {
        const message = "hi vegeta"
        const res = await request(app)
            .post(`/messages/${receiver.id}`)
            .set("Authorization", "bearer token")
            .send({ message })

        expect(res.statusCode).toBe(201)
        expect(res.body.data.token).toBe("token")
        expect(res.body.data.message.text).toBe(message)
    })

    test("retrieve messages", async () => {
        const res = await request(app)
            .get(`/messages/${receiver.id}`)
            .set("Authorization", "bearer token")
        
        expect(res.body.data).toEqual({
            messages: expect.anything()
        })
    })
})