const express = require("express")
const User = require("./db/models/user")
const Task = require("./db/models/task")
const { rawListeners } = require("./db/models/user")

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


app.get("/users", (req, res) => {
    User.find({}).then(users => {
        res.send(users)
    }).catch(err => {
        res.status(500).send()
    })
})


app.get("/users/:id", (req, res) => {
    const _id = req.params.id

    User.findById(_id).then(user => {
        if (!user) {
            return res.status(404).send(`User with id:${_id} do not exist.`)
        }
        res.send(user)
    }).catch(err => {
        res.status(500).send(err)
    })
})


app.get("/tasks", (req, res) => {
    Task.find().then(tasks => {
        res.send(tasks)
    }).catch(err => {
        res.status(401).send(err)
    })
})


app.get("/tasks/:id", (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then(task => {
        if (!task) {
            return res.status(404).send(`Task with id: ${_id} not found.`)
        }
        res.send(task)
    }).catch(err => {
        res.status(500).send(err)
    })
})


app.listen(port, () => {
    console.log(`Server is runing in port ${port}...`);
})