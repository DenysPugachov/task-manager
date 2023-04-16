const request = require("supertest")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const app = require("../app")
const User = require("../models/userModel")


//generate new id for userOne
const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: "userOne",
    email: "userOne@gmail.com",
    password: "userOne123",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    // console.log(' before Each:>> ');
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

test("Should get current user profile", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should NOT get current user profile for unauthenticated user.", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
})

test("Should delete accout for current user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should NOT delete accout for unauthorized user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})
