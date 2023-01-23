const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/tasks-api", {
    useNewUrlParser: true,
})

const User = mongoose.model("User", {
    name: {
        type: String,
    },
    age: {
        type: Number
    }
})

const Task = mongoose.model("Task", {
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
    }

})

const den = new User({
    name: "Denys",
    age: "24"
})

den.save().then(() => {
    console.log('den :>> ', den);
}).catch(error => {
    console.log('error :>> ', error);
})


const learnTask = new Task({
    description: "Learn node.js",
    completed: false,
})

learnTask.save().then(() => {
    console.log('learn :>> ', learnTask);
}).catch(err => {
    console.log('err :>> ', err);
})

 