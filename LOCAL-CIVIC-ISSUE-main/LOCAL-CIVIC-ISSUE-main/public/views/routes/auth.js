const express = require("express");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const db = req.app.locals.db;
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.send("All fields are required");

  const existingUser = await db.collection("users").findOne({ username });
  if (existingUser) return res.send("Username already exists");

  await db.collection("users").insertOne({ username, email, password });
  res.redirect("/login.html");
});

router.post("/login", async (req, res) => {
  const db = req.app.locals.db;
  const { username, password } = req.body;
  if (!username || !password) return res.send("Username and password required");

  const user = await db.collection("users").findOne({ username, password });
  if (!user) return res.send("Invalid login");

  res.redirect("/main.html");
});

module.exports = router;
