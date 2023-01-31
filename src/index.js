const express = require("express");
const tasksRouter = require("./routes/tasksRouter");
const usersRouter = require("./routes/usersRouter");

//connect ot db
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

//automatically parse incoming body form json to an object
app.use(express.json());

//registering a new route
app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => {
   console.log(`Server is runing in port ${port}...`);
});
