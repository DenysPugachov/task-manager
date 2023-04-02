const request = require("supertest")
const app = require("../app")

test("Should signup new user", async () => {
    await request(app).post("/users").send({
        name: "Den2",
        email: "den2@gmail.com",
        password: "Den1213"
    }).expect(201)
})

