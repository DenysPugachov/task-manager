const express = require("express");
const Task = require("./db/models/task");
const User = require("./db/models/user");

//connect ot db
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

//automatically parse incoming json to an object
app.use(express.json());

app.post("/users", async (req, res) => {
   const user = new User(req.body);

   try {
      await user.save();
      res.status(201).send(user);
   } catch (err) {
      res.status(400).send(err);
   }
});

app.get("/users/:id", async (req, res) => {
   const _id = req.params.id;

   try {
      const user = await User.findById(_id);
      if (!user) {
         return res.status(404).send(`User with id:${_id} do not exist.`);
      }
      res.status(200).send(user);
   } catch (err) {
      res.status(500).send(err);
   }
});

app.get("/users", async (req, res) => {
   try {
      const users = await User.find({});
      res.send(users);
   } catch (err) {
      res.status(400).send(err);
   }
});

app.patch("/users/:id", async (req, res) => {
   //checking is user alow to update this field
   const updates = Object.keys(req.body);
   const allowedUpdates = ["name", "email", "age"];
   const isUpdatesValid = updates.every(field =>
      allowedUpdates.includes(field)
   );

   if (!isUpdatesValid) {
      return res.status(400).send(`Change is not valid.`);
   }

   const _id = req.params.id;

   try {
      const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
         new: true, // return updatedUser info
         runValidators: true,
      });

      if (!updatedUser) {
         return res.status(404).send();
      }
      res.send(updatedUser);
   } catch (err) {
      res.status(400).send(err);
   }
});

app.delete("/users/:id", async (req, res) => {
   const _id = req.params.id;
   try {
      const deletedUser = await User.findByIdAndDelete(_id);
      if (!deletedUser) {
         return res.status(404).send(`User with id ${_id} not found.`);
      }
      res.status(200).send(deletedUser);
   } catch (err) {
      res.status(500).send(err);
   }
});

//========Task route=======
app.post("/tasks", async (req, res) => {
   const task = new Task(req.body);

   try {
      await task.save();
      res.status(201).send(task);
   } catch (err) {
      res.status(400).send(err);
   }
});

app.get("/tasks", async (req, res) => {
   try {
      const tasks = await Task.find({});
      res.status(200).send(tasks);
   } catch (err) {
      res.status(401).send(err);
   }
});

app.get("/tasks/:id", async (req, res) => {
   const _id = req.params.id;

   try {
      const task = await Task.findById(_id);
      if (!task) {
         return res.status(404).send(`Task with id: ${_id} not found.`);
      }
      res.status(200).send(task);
   } catch (err) {
      res.status(500).send(err);
   }
});

app.patch("/tasks/:id", async (req, res) => {
   // allowed fields validation
   const updateData = Object.keys(req.body);
   const allowedField = ["description", "completed"];
   const isUpdatesValid = updateData.every(field =>
      allowedField.includes(field)
   );

   if (!isUpdatesValid) {
      return res.status(403).send(`Error: You can NOT update ${updateData}.`);
   }

   const _id = req.params.id;

   try {
      const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {
         new: true, //return updated document
         runValidators: true,
      });
      res.status(202).send(updatedTask);
   } catch (err) {
      res.status(400).send(err);
   }
});

app.delete("/tasks/:id", async (req, res) => {
   const _id = req.params.id;
   try {
      const deletedTask = await Task.findByIdAndDelete(_id);
      if (!deletedTask) {
         return res.status(404).send(`Task with id ${_id} not found.`);
      }
      res.send(deletedTask);
   } catch (err) {
      res.status(500).send(err);
   }
});

app.listen(port, () => {
   console.log(`Server is runing in port ${port}...`);
});
