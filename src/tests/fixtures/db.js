const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../models/userModel")


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

const setupDB = async () => {
    await User.deleteMany({})
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setupDB
}