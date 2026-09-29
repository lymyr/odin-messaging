import { isValidJwt } from "../../middleware/isValidJwt.js";
import jwt from "jsonwebtoken"

afterEach(() => {
    jest.clearAllMocks()
})

const req = { 
    headers: {
        authorization: "bearer token"
    } 
}

const res = {
    status: jest.fn(() => res),
    json: jest.fn()
}
const next = jest.fn()

test("attaches to req and calls next if jwt is valid", () => {
    const data = { 
        iat: 6,
        exp: 7
    }
    const jwtVerify = jest.spyOn(jwt, "verify")
    jwtVerify.mockReturnValue(data)
    
    isValidJwt(req, res, next)

    expect(res.json.mock.calls).toHaveLength(0)
    expect(next.mock.calls).toHaveLength(1)
    expect(req.decodedToken).toEqual(data)
    jwtVerify.mockRestore()
})

test("sends error if jwt is invalid", () => {
    const jwtVerify = jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error()
    })
    
    isValidJwt(req, res, next)
    expect(res.json.mock.calls).toHaveLength(1)
    expect(next.mock.calls).toHaveLength(0)
    jwtVerify.mockRestore()
})