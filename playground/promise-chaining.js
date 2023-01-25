const User = require("../src/db/models/user");

require("../src/db/mongoose");

User.updateMany({ name: "Jane" }, { name: "Jane The Man" }).then(user => {
   console.log("user :>> ", user);
   return User.countDocuments({ name: "Den" })
      .then(countResult => {
         console.log("countResult :>> ", countResult);
      })
      .catch(err => {
         console.log("err :>> ", err);
      });
});
