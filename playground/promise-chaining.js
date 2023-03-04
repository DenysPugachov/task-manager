const Task = require("../src/models/taskModel");
const User = require("../src/models/userModel");

//connect to local DB
require("../src/db/mongoose");

// User.updateMany({ name: "Jane The Man" }, { name: "Jenny" }).then(user => {
//    console.log("user :>> ", user);
//    return User.countDocuments({ name: "Den" })
//       .then(countResult => {
//          console.log("countResult :>> ", countResult);
//       })
//       .catch(err => {
//          console.log("err :>> ", err);
//       });
// });

const updateNameAndCount = async (id, name) => {
   const user = await User.findByIdAndUpdate(id, { name });
   const count = await User.countDocuments({ name });
   return { user, count };
};

// updateNameAndCount("63d1860d62d128854f59960a", "Ievheniia")
//    .then(res => {
//       console.log("res :>> ", res);
//    })
//    .catch(err => {
//       console.log("err :>> ", err);
//    });

const deleteTaskAndCountDone = async id => {
   const deletedTask =
      (await Task.findByIdAndDelete(id)) || `Task with ${id} not found.`;
   const doneTaskCounter = await Task.countDocuments({ completed: true });
   const undoneTaskCounter = await Task.countDocuments({ completed: false });
   return { doneTaskCounter, undoneTaskCounter, deletedTask };
};

deleteTaskAndCountDone("63d76418779ec897d9341686")
   .then(res => {
      console.log("Done task:>> ", res);
   })
   .catch(err => {
      console.log("err :>> ", err);
   });
