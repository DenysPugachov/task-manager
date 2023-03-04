const express = require("express");
const usersRouter = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

usersRouter.post("/users", async (req, res) => {
   const user = new User(req.body);
   try {
      const token = await user.generateAuthToken();
      await user.save();
      res.status(201).send({ user, token });
   } catch (err) {
      res.status(400).send(err);
   }
});

// Logging user route
usersRouter.post("/users/login", async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      res.send({ user, token });
   } catch (err) {
      res.status(400).send();
   }
});

//Logout user
usersRouter.post("/users/logout", auth, async (req, res) => {
   try {
      req.user.tokens = req.user.tokens.filter(token => {
         return req.token !== token.token;
      });

      await req.user.save();

      res.send(req.user);
   } catch (e) {
      res.status(500).send();
   }
});

//Logout All users
usersRouter.post("/users/logoutall", auth, async (req, res) => {
   try {
      req.user.tokens = [];

      await req.user.save();

      res.send("You are logout form all of your sessions.");
   } catch (e) {
      req.status(500);
   }
});

usersRouter.get("/users/me", auth, async (req, res) => {
   res.send(req.user);
});

usersRouter.get("/users/:id", async (req, res) => {
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

usersRouter.patch("/users/:id", async (req, res) => {
   //checking is user alow to update this field
   const updates = Object.keys(req.body);
   const allowedUpdates = ["name", "email", "age", "password"];
   const isUpdatesValid = updates.every(field =>
      allowedUpdates.includes(field)
   );

   if (!isUpdatesValid) {
      return res.status(400).send(`Change is not valid.`);
   }

   const _id = req.params.id;

   try {
      // use insted of  Model.findByIdAndUpdate() to run Middleware
      const user = await User.findById(_id);
      updates.forEach(field => (user[field] = req.body[field]));
      // here runs middleware
      await user.save();

      if (!user) {
         return res.status(404).send();
      }
      res.send(user);
   } catch (err) {
      res.status(400).send(err);
   }
});

usersRouter.delete("/users/:id", async (req, res) => {
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

module.exports = usersRouter;
