import { getChat, createChat } from "../../helpers/chatQueries.js";
import { prisma } from "../../lib/prisma.js";

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

const receiver2 = {
    id: "pikolow",
    name: "daimao king",
    password: "dragon ballz"
}

beforeAll(async () => {
    await prisma.user.createMany({
        data: [
            messenger,
            receiver,
            receiver2
        ]
    })
})

afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.chat.deleteMany()
    await prisma.$disconnect()
})

test("create chat", async () => {
    const emptyChat = await prisma.chat.findMany()
    expect(emptyChat.length).toBe(0)
    await Promise.all([
        createChat([messenger.id, receiver.id]),
        createChat([messenger.id, receiver2.id])
    ])
    const chat = await prisma.chat.findMany()
    expect(chat.length).toBe(2)
})

test("retrieve chat", async () => {
    const [chatWVegeta, chatWPiccolo, nonExistentChat] = await Promise.all([
        getChat([messenger.id, receiver.id]),
        getChat([messenger.id, receiver2.id]),
        getChat([receiver.id, receiver2.id])
    ])

    expect(chatWVegeta).toBeTruthy()
    expect(chatWPiccolo).toBeTruthy()
    expect(nonExistentChat).toBeFalsy()
})