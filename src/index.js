const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// dotenv configuration
require("dotenv").config({ path: "./src/config/.env" });

// App configuration
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Cors config
const cors = require("cors");
const corsOptions = {
  // origin: "https://zed65pro.github.io/socialmedia",
  origin: "*",
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  // credentials: true, // allow cookies to be sent
  optionsSuccessStatus: 200, // for legacy browser support
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Body parser and json configuration
app.use(bodyParser.json());

// Mongoose configuration
require("./config/database")();

// route configuration
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));
app.use("/post", require("./routes/likes.js"));
app.use("/users", require("./routes/friends.js"));
app.use("/users", require("./routes/users.js"));
app.use("/search", require("./routes/search.js"));

// Port configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
