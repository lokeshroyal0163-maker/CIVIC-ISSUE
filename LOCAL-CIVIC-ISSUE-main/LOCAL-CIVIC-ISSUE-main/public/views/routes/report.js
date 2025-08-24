const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");

router.get("/", (req, res) => {
  res.sendFile("report.html", { root: "./views" });
});

router.post("/", async (req, res) => {
  await Issue.create({
    userId: req.session.userId,
    category: req.body.category,
    description: req.body.description,
    location: req.body.location,
  });
  res.redirect("/issues");
});

module.exports = router;

