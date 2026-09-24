import request from "supertest"
import app from "../../app.js"
import { prisma } from "../../lib/prisma.js"

afterEach(async () => {
    jest.clearAllMocks()
})

afterAll(async () => {
    await prisma.$disconnect()
})

const payloadTemplate = {
    username: "JsonDerulo",
    password: "123",
    confirmPassword: "123",
    displayName: "jason derulo",
}

describe("account creation", () => {
    afterEach(async () => {
        await prisma.user.deleteMany()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })
    const prismaUserMock = jest.spyOn(prisma.user, "create")
    
    test("creates account", async () => {
        const res = await request(app)
            .post("/v1/register")
            .send(payloadTemplate)
        
        expect(prismaUserMock.mock.calls).toHaveLength(1)
        expect(res.statusCode).toBe(201)
    })

    test("restrict username spaces", async () => {
        const res = await request(app)
            .post("/v1/register")
            .send({
                ...payloadTemplate,
                username: "space space"
            })
        expect(prismaUserMock.mock.calls).toHaveLength(0)
        expect(res.statusCode).toBe(400)
    })

    test("restrict invalid confirm password", async () => {
        const res = await request(app)
            .post("/v1/register")
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
            .post("/v1/register")
            .send({...payloadTemplate, username: "naruto"})

        expect(prismaUserMock.mock.calls).toHaveLength(0)
        expect(res.statusCode).toBe(409)
    })
})

describe("login", () => {
    beforeAll(async () => {
        await request(app)
            .post("/v1/register")
            .send({...payloadTemplate})
    })
    afterAll(async () => {
        await prisma.user.deleteMany()
    })
    
    test("correct credentials", async () => {
        const res = await request(app)
            .post("/v1/login")
            .send(payloadTemplate)
        expect(res.body.data).toEqual({
            token: expect.anything()
        })
    })

    test("incorrect credentials", async () => {
        const res = await request(app)
            .post("/v1/login")
            .send({...payloadTemplate, password:"sdkfgsdlkf"})
        
        expect(res.body).toEqual({
            errors: expect.anything()
        })
    })
})