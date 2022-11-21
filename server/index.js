require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoAPIError } = require("mongodb");
//routes
const fileTreeRoutes = require("./routes/fileTree");
//db
const db = require("./db/conn");
const app = express();
const PORT = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//testing
app.get("/", (req, res) => {
  res.send("Who are you?");
});

//routes
app.use("/api", fileTreeRoutes);
//connection
async function main() {
  try {
    await db.Connect();
    console.log("Database is connected!");
  } catch (error) {
    if (error instanceof MongoAPIError) {
      console.log(error);
    }
  }
}
main().catch(console.dir);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
