const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  title: String,
  content: String,
  status: String,
});

module.exports = mongoose.model("notes", userSchema);
