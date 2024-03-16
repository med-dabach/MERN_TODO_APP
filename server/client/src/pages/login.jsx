import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError, setUser as setuser } from "../redux/slices/authSlice";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErr(null);
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !pwd) {
      let error = {};
      if (!user) {
        error.user = "Please enter a username";
      }
      if (!pwd) {
        error.pwd = "Please enter a password";
      }
      setErr(error);
    } else {
      dispatch(setError(null));

      const logedInUser = await login(user, pwd, setErr, setLoading);
      dispatch(setuser({ user: logedInUser }));
      if (logedInUser) {
        navigate("/");
        setUser("");
        setPwd("");
      }
    }
  };
  return (
    <>
      <Nav>
        <li>
          <Link
            to={"/signup"}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign up
          </Link>
        </li>
      </Nav>
      <div className="">
        <div className="container flex justify-center min-h-[90vh]  items-center  ">
          <div className="w-full max-w-xs ">
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
              onSubmit={handleSubmit}
            >
              {err?.response && (
                <p className="text-red-500 text-xs italic">{err?.response}</p>
              )}
              {/*  */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className={`${
                    err?.user ? "border-red-500" : ""
                  } shadow appearance-none border rounded w-full py-2 px-3 mb-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  id="username"
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                />
                {err?.user && (
                  <p className="text-red-500 text-xs italic">{err.user}</p>
                )}
              </div>
              {/*  */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className={`${
                    err?.pwd ? "border-red-500 " : ""
                  } shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline`}
                  id="password"
                  type="password"
                  placeholder="***********"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                />
                {err?.pwd && (
                  <p className="text-red-500 text-xs italic">{err.pwd}</p>
                )}
              </div>
              {/*  */}
              <div className="flex items-center justify-between">
                <button
                  disabled={err || loading}
                  className="disabled:bg-green-200 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Login
                </button>
                <Link
                  className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800"
                  to="/passwordreset"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
