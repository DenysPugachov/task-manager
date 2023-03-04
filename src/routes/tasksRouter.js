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

tasksRouter.get("/tasks", auth, async (req, res) => {
   try {
      // const tasks = await Task.find({ owner: req.user._id });

      await req.user.populate("tasks");
      res.status(200).send(req.user.tasks);
   } catch (err) {
      res.status(401).send(err);
   }
});

tasksRouter.get("/tasks/:id", auth, async (req, res) => {
   const _id = req.params.id;

   try {
      const task = await Task.findOne({ _id, owner: req.user._id });
      if (!task) {
         return res.status(404).send();
      }
      res.status(200).send(task);
   } catch (err) {
      res.status(500).send(err);
   }
});

tasksRouter.patch("/tasks/:id", auth, async (req, res) => {
   // allowed fields validation
   const update = Object.keys(req.body);
   const allowedField = ["description", "completed"];
   const isUpdatesValid = update.every(field => allowedField.includes(field));

   if (!isUpdatesValid) {
      return res.status(403).send(`Error: You can NOT update ${update}.`);
   }

   try {
      const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

      if (!task) {
         return res.status(404).send("No task");
      }

      update.forEach(field => (task[field] = req.body[field]));
      await task.save();

      res.status(202).send(task);
   } catch (err) {
      res.status(400).send(err);
   }
});

tasksRouter.delete("/tasks/:id", auth,async (req, res) => {
   const _id = req.params.id;
   try {
      // const deletedTask = await Task.findByIdAndDelete(_id);
      const deletedTask = await Task.findOneAndDelete({ _id, owner: req.user._id })
      
      if (!deletedTask) {
         return res.status(404).send(`Task not found.`);
      }
      res.send(deletedTask);
   } catch (err) {
      res.status(500).send(err);
   }
});

module.exports = tasksRouter;
