import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      // console.log(action.payload);
      state.user = action.payload.user;
    },
    deleteUser: (state) => {
      state.user = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, deleteUser, setError } = authSlice.actions;
export default authSlice;
