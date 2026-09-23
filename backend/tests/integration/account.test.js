import request from "supertest"
import app from "../../app.js"
import { prisma } from "../../lib/prisma.js"

afterEach(async () => {
    jest.clearAllMocks()
    await prisma.user.deleteMany()
})

afterAll(async () => {
    await prisma.$disconnect()
})

describe("account creation", () => {
    afterAll(() => {
        jest.restoreAllMocks()
    })
    const prismaUserMock = jest.spyOn(prisma.user, "create")
    const payloadTemplate = {
        username: "JsonDerulo",
        password: "123",
        confirmPassword: "123",
        displayName: "jason derulo",
    }

    test("creates account", async () => {
        const res = await request(app)
            .post("/")
            .send(payloadTemplate)
        
        expect(prismaUserMock.mock.calls).toHaveLength(1)
        expect(res.statusCode).toBe(201)
    })

    test("restrict username spaces", async () => {
        const res = await request(app)
            .post("/")
            .send({
                ...payloadTemplate,
                username: "space space"
            })
        expect(prismaUserMock.mock.calls).toHaveLength(0)
        expect(res.statusCode).toBe(400)
    })

    test("restrict invalid confirm password", async () => {
        const res = await request(app)
            .post("/")
            .send({...payloadTemplate, confirmPassword: "onepiece"})

        expect(prismaUserMock.mock.calls).toHaveLength(0)
        expect(res.statusCode).toBe(400)
    })

    test("restrict existing username", async () => {
        await prisma.user.create({ data: {
            id: "naruto",
            name: "naruto uzumaki",
            password: "abc",
        }})
        prismaUserMock.mockClear()
        const res = await request(app)
            .post("/")
            .send({...payloadTemplate, username: "naruto"})

        expect(prismaUserMock.mock.calls).toHaveLength(0)
        expect(res.statusCode).toBe(409)
    })
})