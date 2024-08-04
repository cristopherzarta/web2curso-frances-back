const mongoose = require("mongoose");
const PORT = process.env.PORT 

const dbConnect = (app) => {

    mongoose.connect(process.env.MONGO_DB_URL, {
        dbName: process.env.MONGO_DB_NAME,
      });
      const db = mongoose.connection;
      
    //  app.use("/courses", courseRoutes);
      
      app.listen(PORT, () => {
        console.log(`App escuchando en puerto ${PORT}`);
      });
      

}

module.exports = dbConnect