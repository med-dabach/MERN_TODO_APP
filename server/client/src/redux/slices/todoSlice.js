import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    showingTo: 0,
    showingFrom: 0,
    resultsCount: 0,
    page: 1,
    limit: 0,
    error: null,
  },
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload?.todos;
      state.showingFrom = action.payload?.showingFrom;
      state.showingTo = action.payload?.showingTo;
      state.resultsCount = action.payload?.resultsCount;
      state.limit = action.payload?.limit;
    },
    setTodo: (state, action) => {
      state.todos.push(action.payload.todo);
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(
        (todo) => todo._id !== action.payload.id
      );
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTodos, setError, setPage, deleteTodo, setTodo } =
  todosSlice.actions;
export default todosSlice;
