const express = require("express");
const tasksRouter = new express.Router();
const Task = require("../db/models/task");

tasksRouter.post("/tasks", async (req, res) => {
   const task = new Task(req.body);
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

      if (!updatedTask) {
         return res.status(404).send(`Task with id ${_id} not found.`);
      }

      res.status(202).send(updatedTask);
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
