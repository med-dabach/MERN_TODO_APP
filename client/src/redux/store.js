import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import todosSlice from "./slices/todoSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    todos: todosSlice.reducer,
  },
});

export default store;
