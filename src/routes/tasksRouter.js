const express = require("express");
const tasksRouter = new express.Router();
const Task = require("../models/taskModel");
const auth = require("../middleware/auth");

tasksRouter.post("/tasks", auth, async (req, res) => {
   // const task = new Task(req.body);
   const task = new Task({
      ...req.body,
      owner: req.user._id,
   });

   try {
      await task.save();
      res.status(201).send(task);
   } catch (err) {
      res.status(400).send(err);
   }
});

tasksRouter.get("/tasks", async (req, res) => {
   try {
      const tasks = await Task.find({});
      res.status(200).send(tasks);
   } catch (err) {
      res.status(401).send(err);
   }
});

tasksRouter.get("/tasks/:id", async (req, res) => {
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

tasksRouter.patch("/tasks/:id", async (req, res) => {
   // allowed fields validation
   const update = Object.keys(req.body);
   const allowedField = ["description", "completed"];
   const isUpdatesValid = update.every(field => allowedField.includes(field));

   if (!isUpdatesValid) {
      return res.status(403).send(`Error: You can NOT update ${update}.`);
   }

   const _id = req.params.id;

   try {
      const task = await Task.findById(_id);

      if (!task) {
         return res.status(404).send(`Task with id ${_id} not found.`);
      }

      update.forEach(field => (task[field] = req.body[field]));
      await task.save();

      res.status(202).send(task);
   } catch (err) {
      res.status(400).send(err);
   }
});

tasksRouter.delete("/tasks/:id", async (req, res) => {
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

module.exports = tasksRouter;
