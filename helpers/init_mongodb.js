const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on("connected", () => {
  console.log("mongoose connected to db");
});

mongoose.connection.on("error", () => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection is disconnected");
});

process.on("SIGINT", async (req, res) => {
  await mongoose.connection.close();
  process.exit(0);
});
