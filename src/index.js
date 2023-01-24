const express = require("express")
const User = require("./db/models/user")
const Task = require("./db/models/task")

//connect ot db
require("./db/mongoose")


const app = express()
const port = process.env.PORT || 3000


//automatically parse incoming json to an object
app.use(express.json())


app.post("/users", (req, res) => {
    //create user obj
    const user = new User(req.body)

    //save user to db & send back user document
    user.save().then(() => {
        res.status(201).send(user)
    }).catch(err => {
        res.status(400).send(err)
    })
})

app.post("/tasks", (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch(err => {
        res.status(400).send(err)
    })


})


app.listen(port, () => {
    console.log(`Server is runing in port ${port}...`);
})