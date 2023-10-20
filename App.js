require("dotenv").config();
const port = process.env.PORT || 1212;
const DATABASE_URL = process.env.DATABASE_URL;
const express = require("express");
const app = express();
const connectDB = require("./Config/connectDB");
const upload = require("./Config/fileMulter");
const {
  sendFile,
  renderFile,
  downloadFile,
  sendEMail,
} = require("./Controller/fileController");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(DATABASE_URL);

app.set("views", path.join(__dirname, "/Views"));
app.set("view engine", "ejs");
app.use(express.static("Public"));

const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("Welcome to the home page of the Sharing Application");
});
app.post("/sendFile", upload.single("File"), sendFile);
app.post("/sendEMail", sendEMail);
app.get("/files/:uuid", renderFile);
app.get("/files/download/:uuid", downloadFile);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server.`);
  err.status = "Fail to load..";
  err.statusCode = 404;
  next(err);
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 400;
  error.status = error.status || "Error";
  res.status(error.statusCode).json({
    success: false,
    status: error.statusCode,
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port number : ${port} `);
});
