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

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:acs (:desc) 1/-1
tasksRouter.get("/tasks", auth, async (req, res) => {
   const match = {};
   const sort = {};

   if (req.query.completed) {
      match.completed = req.query.completed === "true";
   }

   if (req.query.sortBy) {
      const partsArr = req.query.sortBy.split(":");
      sort[partsArr[0]] = partsArr[1] === "asc" ? 1 : -1;
   }

   try {
      await req.user.populate({
         path: "tasks",
         match,
         options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort,
         },
      });
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
      const task = await Task.findOne({
         _id: req.params.id,
         owner: req.user._id,
      });

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

tasksRouter.delete("/tasks/:id", auth, async (req, res) => {
   const _id = req.params.id;
   try {
      // const deletedTask = await Task.findByIdAndDelete(_id);
      const deletedTask = await Task.findOneAndDelete({
         _id,
         owner: req.user._id,
      });

      if (!deletedTask) {
         return res.status(404).send(`Task not found.`);
      }
      res.send(deletedTask);
   } catch (err) {
      res.status(500).send(err);
   }
});

module.exports = tasksRouter;
