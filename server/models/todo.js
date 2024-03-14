const mongoose = require("../db");

const todoSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "todo name required"],
  },
  disc: {
    type: String,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ["low", "high", "medium"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: [true, "userId is required"],
  },
  lastUpdate: {
    type: Date,
    default: function (val) {
      val = this.createdAt;
    },
  },
});

todoSchema.pre("save", function (next) {
  this.lastUpdate = new Date();
  next();
});

// deselect fields
todoSchema.pre(/^find/, function () {
  this.select("-__v");
});
module.exports = mongoose.model("todo", todoSchema);
