const express = require("express");
const tasksRouter = require("./routes/tasksRouter");
const usersRouter = require("./routes/usersRouter");

//connect ot db
require("./db/mongoose");

//create express server
const app = express();

//automatically parse incoming body form json to an object
app.use(express.json());

//registering a new route
app.use(usersRouter);
app.use(tasksRouter);

module.exports = app 