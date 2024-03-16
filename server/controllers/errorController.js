exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.errorHandler = (err, req, res, next) => {
  if (process.env.ENV === "development") {
    console.log(err.message);
    console.log(err.name);
    console.log(err.code);
    if (err.name === "CastError") {
      res
        .status(400)
        .json({ status: "error", error: err, message: "Invalid ID" });
    } else if (err.name === "ValidationError") {
      res
        .status(400)
        .json({ status: "error", error: err, message: err.message });
    } else if (err.name === "JsonWebTokenError") {
      res
        .status(401)
        .json({ status: "error", error: err, message: "unauthorized" });
    } else if (err.name === "TokenExpiredError") {
      res
        .status(401)
        .json({ status: "error", error: err, message: "Token expired" });
    } else if (err.name === "MongoServerError" && err.code === 11000) {
      res
        .status(409)
        .json({ status: "error", message: "Duplicate field value" });
    } else {
      res
        .status(500)
        .json({ status: "error", error: err, message: err.message, err });
    }
  } else if (process.env.ENV === "production") {
    if (err.name === "ValidationError" || err.name === "CastError") {
      res.status(400).json({ status: "error", message: "Bad Request" });
    } else if (err.name === "JsonWebTokenError") {
      res.status(401).json({ status: "error", message: "unauthorized" });
    } else if (err.name === "TokenExpiredError") {
      res.status(401).json({ status: "error", message: "Token expired" });
    } else if (err.name === "MongoServerError" && err.code === 11000) {
      res
        .status(409)
        .json({ status: "error", message: "Duplicate field value" });
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Something went wrong" });
    }
  }
  next(err);
};
