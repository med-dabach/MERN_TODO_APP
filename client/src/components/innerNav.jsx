import { logout } from "../api/auth";
import PropTypes from "prop-types";

const InnerNav = ({ user }) => {
  const handleLogout = async () => {
    logout();
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="border-b-green-200 border-b-[1px]">
      <div className="container flex justify-between items-center">
        <h1 className="font-bold text-lg">
          <span className="text-green-500">Daily</span>
          <span className="text-gray-800">Todo</span>
        </h1>
        <ul className="flex justify-between items-center gap-3 py-2">
          <p>
            welcome: <span className="font-bold">{user?.userName}</span>
          </p>
          <button
            onClick={handleLogout}
            className="hover:bg-red-400 bg-transparent rounded-lg  border-[1px] hover:text-white text-red-400 font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

// proptypes

InnerNav.propTypes = {
  user: PropTypes.object,
};

export default InnerNav;
