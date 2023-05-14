const request = require("supertest")
const app = require("../app")
const User = require("../models/userModel")
const { userOne, userOneId, setupDB } = require("./fixtures/db")

beforeEach(setupDB)

test("Should signup new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "Den",
            email: "den@gmail.com",
            password: "Den123"
        })
        .expect(201)

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

    // console.log('loggedUser :>> ', loggedUser.tokens);
    // console.log('response.body.token :>> ', response.body);

    //Assert to match user second token[1]
    expect(response.body.token).toBe(loggedUser.tokens[1].token)
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

test("Should upload user avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "src/tests/fixtures/profile-pic.jpg")
        .expect(200)

    const user = await User.findById(userOneId)

    // .toBe  => ===
    // .toEqual => compare props of an object
    // expect.any(data type)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Den",
            email: "den@gmail.com",
        })
        .expect(200)

    const user = await User.findById(userOneId)

    //check if user name is changed
    expect(user.name).not.toBe(userOne.name)
})


test("Should not update invalid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Germany"
        })
        .expect(400)
})



