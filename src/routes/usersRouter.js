const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const usersRouter = new express.Router();
const User = require("../models/userModel");
const auth = require("../middleware/auth");


// Configuring files to accept for avatars
const uploadConfig = multer({
   limits: {
      fileSize: 1000000,
   },
   fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
         return cb(new Error("Please upload an image."));
      }
      cb(undefined, true);
   },
});

// Signup new user
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


// Upload user avatar route
usersRouter.post("/users/me/avatar", auth, uploadConfig.single("avatar"), async (req, res) => {
   // format image to DB stadarts with sharp 
   const bufferImage = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()

   req.user.avatar = bufferImage
   await req.user.save();
   res.send();
}, // in case of an error
   (error, req, res, next) => {
      res.status(400).send({ error: error.message });
   }
);


// Logging user
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


//Get current user profile
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


//Get Current User Avatar
usersRouter.get("/users/me/avatar", auth, async (req, res) => {
   try {
      if (!req.user.avatar) {
         throw new Error("Avatar of current user do not exist.");
      }
      res.set("Content-Type", "image/png");
      res.send(req.user.avatar)
   } catch (e) {
      res.status(404).send(e.toString());
   }
})


//Get user avatar by userID
usersRouter.get("/users/:id/avatar", async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      if (!user || !user.avatar) {
         throw new Error();
      }

      res.set("Content-Type", "image/png");
      res.send(user.avatar);
   } catch (e) {
      res.status(404).send();
   }
})


usersRouter.patch("/users/me", auth, async (req, res) => {
   //checking is user alow to update this field
   const updates = Object.keys(req.body);
   const allowedUpdates = ["name", "email", "age", "password"];

   const isUpdatesValid = updates.every(field => allowedUpdates.includes(field));

   if (!isUpdatesValid) {
      return res.status(400).send(`Change is not valid.`);
   }

   try {
      updates.forEach(field => (req.user[field] = req.body[field]));

      await req.user.save();

      res.send(req.user);
   } catch (err) {
      res.status(400).send(err);
   }
})

//Delete account for current user
usersRouter.delete("/users/me", auth, async (req, res) => {
   try {
      await req.user.remove();

      res.status(200).send(req.user);
   } catch (err) {
      res.status(500).send(err);
   }
});


usersRouter.delete("/users/me/avatar", auth, async (req, res) => {
   try {
      if (!req.user.avatar) {
         res.status(400).send("You do no have an avatar.");
         return;
      }

      req.user.avatar = undefined;
      await req.user.save();

      res.status(200).send("Your avatar was successfully deleted.");
   } catch (err) {
      res.status(500).send(err);
   }
});




module.exports = usersRouter;
