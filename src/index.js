const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

// dotenv configuration
require("dotenv").config({ path: "./src/config/.env" });

// App configuration
const app = express();

// Socket.io config
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200, // for legacy browser support
  },
});

io.on("connection", (socket) => {
  console.log("A new client connected");

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Handle chat message event
  socket.on("chat message", (message) => {
    console.log("Received message:", message);
    // Broadcast the message to all connected clients

    const room = "-12";
    io.to(room).emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

// Media content size limit
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
app.use("/comments", require("./routes/comments.js"));

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
