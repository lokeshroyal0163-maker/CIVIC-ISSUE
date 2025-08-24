const express = require("express");
const router = express.Router();

router.post("/contact", async (req, res) => {
  const db = req.app.locals.db;
  const { name, email, message } = req.body;

  await db.collection("contacts").insertOne({ name, email, message });
  res.send("Thank you for contacting us!");
});

module.exports = router;
