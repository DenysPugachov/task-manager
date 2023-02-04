const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// allow to use middleware
const userSchema = new mongoose.Schema({
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
});

userSchema.statics.findByCredentials = async (email, password) => {
   const user = await User.findOne({ email });

   if (!user) {
      throw new Error("Unable to logging.");
   }

   const isMatch = await bcrypt.compare(password, user.password);

   if (!isMatch) {
      throw new Error("Unable to logging.");
   }

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

const User = mongoose.model("User", userSchema);
//after defining "uniqui: true" run Once for db to building unique indexes
// User.init();

module.exports = User;
