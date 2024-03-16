const { mongo } = require("mongoose");

const Todo = require("../models/todo"),
  { catchAsync } = require("./errorController"),
  mongoose = require("../db");

exports.getAllTodos = catchAsync(async (req, res, next) => {
  const user = req.user;

  const fields = req.query?.fields?.split(",").join(" ");

  // search
  const excludeFields = ["fields", "limit", "sort", "page"];
  let searchQuery = { ...req.query };
  excludeFields.forEach((e) => {
    delete searchQuery[e];
  });

  Object.keys({ ...searchQuery }).forEach((k) => {
    searchQuery[k] = {
      $regex: new RegExp(`\\b\\w*${searchQuery[k]}\\w*\\b`, "gi"),
    };
  });

  const sort = req.query?.sort?.split(",").join(" ");
  const limit = req.query?.limit || 10;
  const page = req.query?.page * 1 > 0 ? req.query?.page * 1 : 1;

  const query = Todo.find({ userId: user.id, ...searchQuery })
    .select(fields)
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit);

  const todos = await query;
  const count = await Todo.countDocuments({ userId: user.id, ...searchQuery });

  res.json({
    status: "success",
    todos,
    resultsCount: count,
    limit,
    showingFrom: (page - 1) * limit,
    showingTo: (page - 1) * limit + todos.length,
  });
});

exports.addTodo = catchAsync(async (req, res, next) => {
  // from auth
  const user = req.user;

  const { name, disc, priority } = req.body;
  const result = await Todo.create({
    name,
    disc,
    priority,
    userId: user.id,
  });
  res.status(201).json({
    status: "success",
    result,
  });
});

exports.updateTodoState = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { isDone } = req.body;

  const result = await Todo.findByIdAndUpdate(id, {
    isDone,
  });
  res.json({
    status: "success",
    result,
  });
});

exports.deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (
    !id ||
    !mongoose.isValidObjectId(id) ||
    !(await Todo.findByIdAndDelete(id))
  )
    return res.status(404).json({
      status: "failed",
      message: "todo not found",
    });

  res.status(204).json({
    status: "success",
  });
});
