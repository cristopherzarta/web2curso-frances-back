const express = require("express");
const { config } = require("dotenv");
config();
const app = express();
const cors = require("cors");

const usersRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const paypalRoutes = require("./routes/paypal");
const authRoutes = require("./routes/auth");
const passport = require("./passport");
const path = require("path");

const bodyParser = require("body-parser");

const dbConnect = require("./db");
const router = express.Router();


//app.use(express.static(path.join(__dirname, './google')));

//Usamos express para los middleware
app.use(cors());
app.use(express.json());
app.use(
  require("express-session")({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json()); //Parseador de bodie
app.use(passport.initialize());
app.use(passport.session());

//ROUTES

app.use('/users', usersRoutes)
app.use('/courses', courseRoutes)
app.use('/paypal', paypalRoutes)
app.use('/auth', authRoutes)

//GOOGLE DOMAIN VERIFICATION

app.get("/google41ce8fbc63aa9a99.html", (req, res) => {
  res.sendFile(
    "google41ce8fbc63aa9a99.html",
    { root: path.join(__dirname) },
    (err) => {
      if (err) {
        next(err);
      } else {
        console.log("File SENT!!");
      }
    }
  );
});

//Aca conectaremos la base de datos

dbConnect(app);