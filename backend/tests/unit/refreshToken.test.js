import refreshToken from "../../middleware/refreshToken.js";
import jwt from "jsonwebtoken";

test("attaches refreshed token to req and calls next", () => {
    const req = {
        decodedToken: { iat: 67, exp: 420 }
    }
    const next = jest.fn()
    const res = jest.fn()
    const jwtSign = jest.spyOn(jwt, "sign")
    jwtSign.mockReturnValue("new token")

    refreshToken(req, res, next)

    expect(jwtSign).toHaveBeenCalledWith({
        ...req.decodedToken,
        exp: expect.anything()
    }, expect.anything())
    expect(next.mock.calls).toHaveLength(1)
    expect(req.refreshToken).toBe("new token")
})