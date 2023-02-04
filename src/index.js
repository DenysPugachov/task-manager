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

// const jwt = require("jsonwebtoken");

// (function () {
//    //test
//    const token = jwt.sign({ _id: "idNumber123" }, "randomChars", {
//       expiresIn: "7 days",
//    }); // (data, signature(secret))=>{}
//    //Base64 :>>    Header(algorithm, type of token)   . Payload (Body=> encoded :>> _id + iat:timestamp) . signature to verify the token
//    //token  :>>  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJpZE51bWJlcjEyMyIsImlhdCI6MTY3NTUwNDM5M30.oewEh3v2K5NvudxD1dYpUDDHUUXwU2vsJRtwh-fzy-I
//    console.log("token :>> ", token);

//    const data = jwt.verify(token, "randomChars");
//    console.log("data :>> ", data);
// })();
