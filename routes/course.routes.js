const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const passport = require("passport");
const Sale = require("../models/sales");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

//obtener las curso

router.get("/", (req, res) => {
  const fullPath = path.join(__dirname, "./google41ce8fbc63aa9a99.html");
  res.sendFile(fullPath);
});

router.get("/", async (req, res) => {
  console.log("holaaaa");
  try {
    const courses = await Course.find();
    res.status(200).json({ ok: true, data: courses });
  } catch (error) {
    console.log({ error });
    res.status(400).json({ ok: false, error });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  console.log({ user_id, id });
  try {
    let hasBoughtTheCourse = false;

    if (mongoose.inValidObjectId(user_id)) {
      const foundCourse = await Sale.exists({
        course: id,
        user: user_id,
      });
      hasBoughtTheCourse = !!foundCourse;
    }

    const course = await Course.findById(id);

    res.status(200).json({
      ok: true,
      data: { ...course.toObject(), hasBoughtTheCourse },
    });
  } catch (error) {
    console.log({ error });
    res.status(400).json({ ok: false, error });
  }
});

router.post("/", async (req, res) => {
  const { name } = req?.body;
  if (!name) {
    return res.status(400).json({
      message: " los campos name son obligatorios",
    });
  }

  const course = new Course({
    name,
  });

  try {
    const newCourse = await course.save();
    console.log(newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
