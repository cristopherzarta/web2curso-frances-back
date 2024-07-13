const express = require("express");
const mongoose = require("mongoose");
const { config } = require("dotenv");
config();

const courseRoutes = require("./routes/course.routes");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");

const bodyParser = require("body-parser");


//Usamos express para los middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()) //Parseador de bodie

//Aca conectaremos la base de datos

mongoose.connect(process.env.MONGO_DB_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;  

app.use('/courses', courseRoutes )

  app.listen(PORT, () => {
    console.log(`App escuchando en puerto ${PORT}`);
  });

