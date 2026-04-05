// require('dotenv').config();
// const mongoose = require('mongoose');

// console.log("Testing MongoDB Connection to:", process.env.MONGO_URI ? "URI DETECTED" : "NO URI");

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("SUCCESS: Connected to DB!");
//     process.exit(0);
//   })
//   .catch(err => {
//     console.error("FAILED ERROR:", err.message);
//     process.exit(1);
//   });
require('dotenv').config();
const mongoose = require('mongoose');

console.log("Testing MongoDB Connection:", process.env.MONGO_URI ? "URI FOUND" : "NO URI");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ SUCCESS: Connected to DB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ FAILED ERROR:", err.message);
    process.exit(1);
  });