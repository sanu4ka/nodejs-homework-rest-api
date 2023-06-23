const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
app.listen(process.env.PORT, () => {
  console.log("Server running. Use our API on port: 3000");
});
