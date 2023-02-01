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

//========test =========
// const bcrypt = require("bcrypt");

// const testBcrypt = async () => {
//    const password = "pass1234";
//    const hashedPassword = await bcrypt.hash(password, 8);

//    console.log("password, hashedPassword :>> ", password, hashedPassword);

//    const isMatch = await bcrypt.compare("pass1234", hashedPassword);
//    console.log("isMatch :>> ", isMatch);
// };

// testBcrypt();
