const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  category: String,
  description: String,
  location: String,
  dateReported: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Issue", issueSchema);
