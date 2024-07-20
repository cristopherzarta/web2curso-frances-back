const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const passport = require('passport')

//obtener las curso

/*router.get("/", (req, res) => {
  console.log(`Esto es un log del entorno: ${process.env.NODE_ENV}`);
  res.send("Hello World!");
});*/

router.get("/",
   async (req, res) => {
    console.log('holaaaa')
    try {
      const courses = await Course.find();
      res.status(200).json({ ok: true, data: courses });
    } catch (error) {
      console.log({ error });
      res.status(400).json({ ok: false, error });
    }
  })
router.get("/:id",
   async (req, res) => {

   const { id } = req.params
   console.log({ id })
    try {
      const course = await Course.findById(id);
      res.status(200).json({ ok: true, data: course });
    } catch (error) {
      console.log({ error });
      res.status(400).json({ ok: false, error });
    }
  })


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
