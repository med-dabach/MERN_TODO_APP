import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Index from "./pages";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/passwordReset";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "./redux/selectors";
import { setError, setUser } from "./redux/slices/authSlice";
import NewPassword from "./pages/newPassword";

function App() {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      dispatch(setUser({ user: parsedUser }));
    } else {
      dispatch(setError("Please login to continue"));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Index />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/passwordReset" element={<PasswordReset />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

const ProtectedRoute = ({ element }) => {
  const user = useSelector(userSelector);
  return user ? element : <Navigate to="/login" replace />;
};

export default App;
