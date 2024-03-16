import { useState } from "react";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";
import { newPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // get the token and email from the query string
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const email = params.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(password)
    ) {
      setError(
        "Password must contain at least 8 characters, including UPPER/lowercase and numbers"
      );
      return;
    }

    if (await newPassword(password, token, email, setError, setLoading)) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <>
      <Nav />
      <div className="container flex justify-center min-h-[90vh] items-center">
        <div className="w-full max-w-xs">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold mb-4">Set New Password</h2>
            {error?.response && (
              <p className="text-red-500 text-xs italic">{error?.response}</p>
            )}
            {success && (
              <p className="text-green-500 text-xs italic">
                Password set successfully. Redirecting to login page...
              </p>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                disabled={loading}
                className="disabled:opacity-55 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Set Password
              </button>
              <Link
                className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800"
                to="/login"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewPassword;
