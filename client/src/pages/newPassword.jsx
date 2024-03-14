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
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Assuming setPassword is an async function that sends a request to set a new password
      await newPassword(password, token, email, setError);
      setSuccess(true);
      // Redirect user to login page after successfully setting the password
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError("Failed to set new password. Please try again.");
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
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
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
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
