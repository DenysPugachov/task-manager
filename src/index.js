const express = require("express");
const tasksRouter = require("./routes/tasksRouter");
const usersRouter = require("./routes/usersRouter");

//connect ot db
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

// express middleware
// app.use((req, res, next) => {
//    if (req.method === "GET") {
//       res.send("GET request are disabled.");
//    } else {
//       next();
//    }
// });

// for maitenese mode
// app.use((req, res, next) => {
//    res.status(503).send(
//       "Site is currently in a maintense mode. Please check back soon..."
//    );
// });

//automatically parse incoming body form json to an object
app.use(express.json());

//registering a new route
app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => {
   console.log(`Server is runing in port ${port}...`);
});

// playground
const Task = require("./models/taskModel");
const User = require("./models/userModel");

const main = async () => {
   // const task = await Task.findById("6403baebd0a9681b73565120");
   // await task.populate("owner");// fill data form User db insted of ._id
   // console.log(task.owner);

   //get data about task from user
   const user = await User.findById("6403b98eaf79c503f442bd1c");
   await user.populate("tasks")
   console.log(user.tasks);
};

main();
