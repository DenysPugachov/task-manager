const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./taskModel");

// allow to use middleware
const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         unique: true, // only unique value can pass validation
         trim: true,
         lowercase: true,
         validate(value) {
            if (!validator.isEmail(value)) {
               throw new Error("Your have to provide a valid email.");
            }
         },
      },
      password: {
         type: String,
         required: true,
         trim: true,
         minlength: 6,
         validate(value) {
            if (value.toLowerCase().includes("password")) {
               throw new Error("Use word 'password' for password is stupid!");
            }
         },
      },
      age: {
         type: Number,
         default: 0,
         validate(value) {
            if (value < 0) {
               throw new Error("Age must be a positive number.");
            }
         },
      },
      tokens: [
         {
            token: {
               type: String,
               required: true,
            },
         },
      ],
      avatar: {
         type: Buffer,
      },
   },
   {
      timestamps: true,
   }
);

// Set virtual property for populating tasks to the user
// "tasks" - name of virtual field in User model
userSchema.virtual("tasks", {
   ref: "Task", //where to reference (link)
   localField: "_id", //field was using in Task.owner (._id in User model).
   foreignField: "owner", //name of the field in ref:"Task" (user.id)
});

// Clear data before sending back to the client
// .toJSON called before JSON.stringify()
userSchema.methods.toJSON = function () {
   const user = this;
   const userObject = user.toObject(); // mongoose meethod: => return raw data

   //delete unnecessary data
   delete userObject.password;
   delete userObject.tokens;
   delete userObject.avatar;

   return userObject;
};

userSchema.methods.generateAuthToken = async function () {
   const user = this;
   const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

   // add token to the user document
   user.tokens = user.tokens.concat({ token });
   await user.save();

   return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
   const user = await User.findOne({ email });

   if (!user) {
      throw new Error("Unable to logging.");
   }

   const isMatch = await bcrypt.compare(password, user.password);

   if (!isMatch) {
      throw new Error("Unable to logging.");
   }

   // console.log('user :>> ', user);

   return user;
};

//hash the plaint text user password before saving
userSchema.pre("save", async function (next) {
   const user = this;
   if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
   }
   next();
});

//Delete all user's tasks before removing the user
userSchema.pre("remove", async function (next) {
   const user = this;
   await Task.deleteMany({ owner: user._id });
   next();
});

const User = mongoose.model("User", userSchema);
//after defining "uniqui: true" run Once for db to building unique indexes
// User.init();

module.exports = User;
