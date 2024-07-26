const express = require("express");
const mongoose = require("mongoose");
const { config } = require("dotenv");
config();

const courseRoutes = require("./routes/course.routes");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("./passport");
const generateJWT = require("./helpers/generateJWT");
const path = require("path");
const router = express.Router();

//app.use(express.static(path.join(__dirname, './google')));

//Usamos express para los middleware
app.use(cors());
app.use(express.json());
app.use(
  require("express-session")({
    secret: "sjsjaieieskskdkd",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json()); //Parseador de bodie
app.use(passport.initialize());
app.use(passport.session());

app.get("/google41ce8fbc63aa9a99.html", (req, res) => {
  res.sendFile(
    "google41ce8fbc63aa9a99.html",
    { root: path.join(__dirname) },
    (err) => {
      if (err) {
        next(err);
      } else {
        console.log("File SENT");
      }
    }
  );
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/login`,
  }),
  function (req, res) {
    console.log({ user: req.user });
    const { _id, firstname, lastname, email, pictureUrl } = req.user;
    // Successful authentication, redirect home.
    const userData = {
      sub: _id,
      firstname,
      lastname,
      email,
      pictureUrl,
    };
    const jwt = generateJWT(userData);
    const login_info = JSON.stringify({ jwt, user: userData });
    console.log({ jwt });
    res.redirect(
      `${process.env.FRONTEND_BASE_URL}/profile?login_info=${login_info}`
    );
  }
);

//Aca conectaremos la base de datos

mongoose.connect(process.env.MONGO_DB_URL, {
  dbName: process.env.MONGO_DB_NAME,
});
const db = mongoose.connection;

app.use("/courses", courseRoutes);

app.listen(PORT, () => {
  console.log(`App escuchando en puerto ${PORT}`);
});
