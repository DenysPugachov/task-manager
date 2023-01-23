const mongoose = require("mongoose")
const validator = require("validator")

mongoose.connect("mongodb://127.0.0.1:27017/tasks-api", {
    useNewUrlParser: true,
})

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Your have to provide a valid email.")
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number.")
            }
        }
    }
})


// Mongoos use "Task"
// const Task = mongoose.model("Task", {
//     description: {
//         type: String,
//     },
//     completed: {
//         type: Boolean,
//     }
// })

const den = new User({
    name: "Jane     ",
    email: "    PUGAenom@f.io",
})

den.save().then(() => {
    console.log('den :>> ', den);
}).catch(error => {
    console.log('error :>> ', error);
})


// const learnTask = new Task({
//     description: "Add something...",
//     completed: false,
// })

// learnTask.save().then(() => {
//     console.log('learn :>> ', learnTask);
// }).catch(err => {
//     console.log('err :>> ', err);
// })

