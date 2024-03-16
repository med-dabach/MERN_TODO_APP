const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// allow all origins
const allowedOrigins = [process.env.PROD_URL, "http://localhost:8000"];

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

// specify the body type for post/patch...
app.use(express.json());

app.use(cookieParser());

// security
app.use(helmet());

app.use(xss());
app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 15 * 1000,
    max: 15,
    message: "Too many requests from this IP, please try again later.",
  })
);

// routes
app.use("/api/todo", auth, todoRouter);

app.use("/api/user", userRouter);

app.use("/api/login", loginRouter);

app.use("/api/logout", auth, logoutRouter);

app.use("/api/passwordreset", passwordResetRouter);

// serve static files ../client/dist to every request
app.use(express.static("./client/dist"));

// serve index.html for all get() requests
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist/index.html"));
});

// error handler
app.use(errorHandler);

module.exports = app;
