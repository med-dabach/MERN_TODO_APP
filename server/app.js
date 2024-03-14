const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// allow all origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8000",
  "http://localhost:4173",
  "http://192.168.0.111:5173",
  "http://192.168.0.111:5173",
  null,
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
app.use("/todo", auth, todoRouter);

app.use("/user", userRouter);

app.use("/login", loginRouter);

app.use("/logout", auth, logoutRouter);

app.use("/passwordreset", passwordResetRouter);

// error handler
app.use(errorHandler);

module.exports = app;
