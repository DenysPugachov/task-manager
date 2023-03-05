const express = require("express");
const tasksRouter = require("./routes/tasksRouter");
const usersRouter = require("./routes/usersRouter");

//connect ot db
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

const multer = require("multer");
const upload = multer({
   dest: "images", // where all file will be stored
});

// upload.single("value match with 'key' in form-data") 
//=> Returns middleware that processes a single file associated with the given form field.
app.post("/upload", upload.single("upload"), (req, res) => {
   res.send();
});

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
