// const { Schema } = require("mongoose");
const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const courseSchema = new Schema(
  {
    name: String,
    thumbnail: String,
    description: String,
    sections: [
      {
        name: String,
        recordeAt: String,
        recordingday: String,
        realDuration: Schema.Types.Mixed,
        videos: [{ title: String, videoUrl: String, duration: String }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema, "Courses");
