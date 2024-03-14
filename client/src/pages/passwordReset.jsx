import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";
import { getPasswordReset } from "../api/auth";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("tawsattawsat130@gmail.com");
  const [err, setErr] = useState(null);

  useEffect(() => {
    setErr(null);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErr({ email: "Please enter a valid email" });
    } else {
      try {
        await getPasswordReset(email, setErr);
      } catch (e) {
        console.error(e);
      }
      setEmail("");
      navigate("/login");
    }
  };

  return (
    <>
      <Nav>
        <li>
          <Link
            to={"/signup"}
            className="bg-transparent text-green-500 hover:bg-green-500 hover:text-white border-green-500 border  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign up
          </Link>
        </li>
        <li>
          <Link
            to={"/login"}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
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
                  Email
                </label>
                <input
                  className={`${
                    err?.email ? "border-red-500" : ""
                  } shadow appearance-none border rounded w-full py-2 px-3 mb-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  id="username"
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                {err?.email && (
                  <p className="text-red-500 text-xs italic">{err.email}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  disabled={err}
                  className="disabled:bg-green-200 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
