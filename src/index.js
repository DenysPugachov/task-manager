const app = require("./app")
const port = process.env.PORT || 3000

// Start express server
app.listen(port, () => {
   console.log(`Express server is runing on port ${port}...`);
});
