const express = require("express"),
  router = express.Router(),
  {
    getAllTodos,
    addTodo,
    updateTodoState,
    deleteTodo,
  } = require("../controllers/todoController");



router.route("/").get(getAllTodos).post(addTodo);

router.route("/:id").patch(updateTodoState).delete(deleteTodo);

module.exports = router;
