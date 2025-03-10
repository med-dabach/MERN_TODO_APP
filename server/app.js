const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("./db");

// allow all origins
const allowedOrigins = [
  process.env.PROD_URL,
  "http://localhost:8000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// security
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");

// routers
const todoRouter = require("./routes/todoRouter");
const userRouter = require("./routes/userRouter");
const loginRouter = require("./routes/loginRouter");
const logoutRouter = require("./routes/logoutRouter");
const passwordResetRouter = require("./routes/passwordResetRouter");

// meddleware
const { auth } = require("./controllers/userController");
const { errorHandler } = require("./controllers/errorController");
const { redirect } = require("react-router-dom");

// specify the body type for post/patch...
app.use(express.json());

app.use(cookieParser());

// security
app.use(helmet());

app.use(xss());
app.use(mongoSanitize());
// app.use(
//   rateLimit({
//     windowMs: 15 * 1000,
//     max: 102,
//     message: "Too many requests from this IP, please try again later.",
//   })
// );

// routes
app.use("/api/todo", auth, todoRouter);

app.use("/api/user", userRouter);

app.use("/api/login", loginRouter);

app.use("/api/logout", auth, logoutRouter);

app.use("/api/passwordreset", passwordResetRouter);

// serve static files ../client/dist to every request

// serve index.html for all get() requests

app.get("/", async (req, res, next) => {
  try {
    // const token = req.cookies?.token;
    // if (!token || !(await jwt.verify(token, process.env.JWT_SECRET)))
    //   return res.redirect("/login");
    res.sendFile(path.resolve(__dirname, "./client/dist/index.html"));

    // jwt{id,userName}
    // const { id } = jwt.decode(token);
    // // verify the id
    // if (!id || !mongoose.isValidObjectId(id) || !(await User.findById(id)))
    //   return res.redirect("/login");
  } catch (err) {
    next(err);
  }
});
app.use(express.static("./client/dist"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist/index.html"));
});

// error handler
app.use(errorHandler);

module.exports = app;
