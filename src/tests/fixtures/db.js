const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../models/userModel")
const Task = require("../../models/taskModel")


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
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "userTwo",
    email: "userTwo@gmail.com",
    password: "userTwo123",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First task",
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second task",
    completed: false,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Third task",
    completed: false,
    owner: userTwo._id
}

//populate testDB 
const setupDB = async () => {
    await User.deleteMany({})
    await Task.deleteMany({})
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDB
}