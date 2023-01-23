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
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            // if (value.length < 6) {
            //     throw new Error("Password length must be greater than 6 char long.")
            // }
            if (value.toLowerCase().includes("password")) {
                throw new Error("Use word 'password' for password is stupid!")
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


const Task = mongoose.model("Task", {
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
})

// const den = new User({
//     name: "Jane     ",
//     email: "Jane@f.io",
//     password: "123456",
//     age: 34
// })

// den.save().then(() => {
//     console.log('den :>> ', den);
// }).catch(error => {
//     console.log('error :>> ', error);
// })


const learnTask = new Task({
    description: "    Create Finka app",
})

learnTask.save().then(() => {
    console.log('learn :>> ', learnTask);
}).catch(err => {
    console.log('err :>> ', err);
})

