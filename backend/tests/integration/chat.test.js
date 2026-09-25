import {prisma} from "../../lib/prisma.js"
import jwt from "jsonwebtoken"
import app from "../../app.js"
import request from "supertest"
import { createChat } from "../../helpers/chatQueries.js"

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

describe("/chats", () => {
    const verifyMockReturnVal = {
        ...messenger,
        iat: 420,
        exp: 467
    }
    
    beforeEach(() => {
        jest.spyOn(jwt, "verify").mockReturnValue(verifyMockReturnVal)
        jest.spyOn(jwt, "sign").mockReturnValue("token")
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    test("retrieve chats", async () => {
        const res = await request(app)
            .get(`/v1/chats`)
            .set("Authorization", "bearer token")
        expect(res.body.data).toEqual({
            chats: expect.any(Array),
            token: "token"
        })
    })

    describe("/:chatid", () => {
        let chat;
        beforeAll(async () => {
            chat = await createChat([messenger.id, receiver.id])
        })
        afterAll(async () => {
            await prisma.chat.deleteMany()
        })

        test("retrieve messages", async () => {
            const res = await request(app)
                .get(`/v1/chats/${chat.id}`)
                .set("Authorization", "bearer token")

            expect(res.body.data).toEqual({
                messages: expect.any(Array),
                token: "token"
            })
        })

        test("send message", async () => {
            const message = "let us fusion, vegeta..."
            const res = await request(app)
                .post(`/v1/chats/${chat.id}`)
                .set("Authorization", "bearer token")
                .send({ message })

            expect(res.statusCode).toBe(201)
            expect(res.body.data.token).toBe("token")
            expect(res.body.data.message.text).toBe(message)
        })

        describe("unauthorized user", () => {
            const unauthUser = {
                id: "evilguy",
                name: "evil guy",
                password: "123"
            }
            beforeAll(async () => {
                await prisma.user.create({
                    data: unauthUser
                })
            })
            afterAll(async () => {
                await prisma.user.delete({
                    where: { id: unauthUser.id }
                })
            })
            beforeEach(() => {
                jest.spyOn(jwt, "verify").mockReturnValue({
                    ...unauthUser,
                    iat: 5,
                    exp: 6
                })
            })

            test("retrieve message", async () => {
                const res = await request(app)
                    .get(`/v1/chats/${chat.id}`)
                    .set("Authorization", "bearer token")

                expect(res.statusCode).toEqual(403)
                expect(res.body).toEqual({
                    errors: expect.anything()
                })
            })

            test("send message", async () => {
                const message = "u filthy saiyan monkey"
                const res = await request(app)
                    .post(`/v1/chats/${chat.id}`)
                    .set("Authorization", "bearer token")
                    .send({ message })

                expect(res.statusCode).toEqual(403)
                expect(res.body).toEqual({
                    errors: expect.anything()
                })
            })
        })
    })

    describe("/user/:userId", () => {
        afterAll(async () => {
            await prisma.chat.deleteMany()
        })

        test("send message", async () => {
            const message = "hi vegeta"
            const res = await request(app)
                .post(`/v1/chats/user/${receiver.id}`)
                .set("Authorization", "bearer token")
                .send({ message })

            expect(res.statusCode).toBe(201)
            expect(res.body.data.token).toBe("token")
            expect(res.body.data.message.text).toBe(message)
        })

        test("retrieve messages", async () => {
            const res = await request(app)
                .get(`/v1/chats/user/${receiver.id}`)
                .set("Authorization", "bearer token")

            expect(res.body.data).toEqual({
                messages: expect.any(Array),
                token: "token"
            })
        })

        describe("jwt error", () => {
            beforeEach(() => {
                jest.restoreAllMocks()
                jest.spyOn(jwt, "verify")
                    .mockImplementation(() => {
                        throw new Error()
                    })
            })
            afterAll(() => {
                jest.restoreAllMocks()
            })
            
            test("malicious user sending message", async () => {
                const message = "meet me @ bulma's crib"
                const res = await request(app)
                    .post(`/v1/chats/user/${receiver.id}`)
                    .set("Authorization", "bearer token")
                    .send({ message })

                expect(res.statusCode).toBe(401)
                expect(res.body).toEqual({
                    errors: expect.anything()
                })
            })

            test("malicious retrieve messages", async () => {
                const res = await request(app)
                    .get(`/v1/chats/user/${receiver.id}`)
                    .set("Authorization", "bearer token")
                
                expect(res.statusCode).toBe(401)
                expect(res.body).toEqual({
                    errors: expect.anything()
                })
            })
        })
    })
})