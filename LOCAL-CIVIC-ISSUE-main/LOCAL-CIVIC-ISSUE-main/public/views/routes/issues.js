const express = require("express");
const router = express.Router();

router.get("/issues", async (req, res) => {
  const db = req.app.locals.db;
  const issues = await db.collection("issues").find().toArray();
  res.json(issues);
});

module.exports = router;
