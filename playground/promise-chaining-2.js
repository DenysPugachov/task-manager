const Task = require("../src/models/taskModel");

require("../src/db/mongoose");

Task.findByIdAndDelete("63d01f11d0bf413d5a700716").then(deletedTask => {
   console.log("deletedTask :>> ", deletedTask);

   return Task.countDocuments({ completed: false })

      .then(countResult => {
         console.log("countResult of uncompleted tasks :>> ", countResult);
      })
      .catch(err => {
         console.log("err :>> ", err);
      });
});
