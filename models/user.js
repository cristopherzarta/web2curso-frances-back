// const { Schema } = require("mongoose");
const { Schema } = require ('mongoose')
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    pictureUrl: String,
    email: String ,
    googleId: String ,
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema, "Users");
