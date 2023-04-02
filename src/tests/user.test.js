const request = require("supertest")
const app = require("../app")
const User = require("../models/userModel")

const userOne = {
    name: "userOne",
    email: "userOne@gmail.com",
    password: "userOne123"
}

beforeEach(async () => {
    console.log(' before Each:>> ');
    await User.deleteMany({})
    await new User(userOne).save()
})

test("Should signup new user", async () => {
    await request(app).post("/users").send({
        name: "Den",
        email: "den@gmail.com",
        password: "Den123"
    }).expect(201)
})

test("Should loging existing user", async () => {
    await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password,
    }).expect(200)
})

test("Should not loging with bad user data", async () => {
    await request(app).post("/users/login").send({
        email: userOne.email,
        password: "WrongPassword"
    }).expect(400)
})

