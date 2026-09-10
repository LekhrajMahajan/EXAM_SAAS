const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");

  // Dynamically import the service (it's compiled in dist or we can just require the model)
  // Wait, if it's TS, it's better to just run it through ts-node or run it in the actual app.
}
run();
