const express = require("express");
const router = express.Router();

router.get("/profile", async (req, res) => {
  const db = req.app.locals.db;
  const user = await db.collection("users").findOne();
  res.json(user);
});

module.exports = router;
