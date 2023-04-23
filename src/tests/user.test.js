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
    const response = await request(app).post("/users").send({
        name: "Den",
        email: "den@gmail.com",
        password: "Den123"
    }).expect(201)

    //Assert that database was chaged correctly 
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about response
    expect(response.body.user.name).toBe("Den")
    expect(response.body).toMatchObject({
        user: {
            name: "Den",
            email: "den@gmail.com"
        },
        token: user.tokens[0].token
    })

    //Assertion password not store in plain text in DB
    expect(response.body.user.password).not.toBe("Den123")

})

test("Should loging existing user", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200)


    //fetch logged user form test DB
    const loggedUser = await User.findById(userOneId)

    console.log('loggedUser :>> ', loggedUser.tokens);
    console.log('response.body.token :>> ', response.body);

    //Assert to match user second token[1]
    expect(response.body.token).toBe(loggedUser.tokens[0].token)

    //FIXME: token[0] and token[1] a the same! (9/10) 
    //TODO: how to change jwt generation base on timestamp? maybe timestamp generation for token is to short?
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

test("Should removed user data to be deleted form DB", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const deletedUser = await User.findById(userOneId)

    expect(deletedUser).toBeNull()
})

test("Should NOT delete accout for unauthorized user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

