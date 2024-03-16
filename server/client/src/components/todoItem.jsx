import { useEffect, useState } from "react";
import { deleteTodo as deleteTodoApi, updateTodo } from "../api/fetching";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { deleteTodo } from "../redux/slices/todoSlice";

const TodoItem = ({ todo }) => {
  const [checked, setChecked] = useState(todo?.isDone);
  const dispatch = useDispatch();
  // console.log(todo);
  useEffect(() => {
    if (todo?.isDone === checked) return;
    updateTodo({ ...todo, isDone: checked });
  }, [checked, todo]);
  function determineColor(priority) {
    // console.log(priority);
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  }

  async function handleDelete() {
    if (await deleteTodoApi(todo?._id)) dispatch(deleteTodo({ id: todo?._id }));
  }

  const dateTime = new Date(todo?.createdAt);

  // Extracting date components
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1; // Months are zero-based, so add 1
  const day = dateTime.getDate();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();

  const normalDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // console.log(normalDate);

  return (
    <>
      <li className="grid  grid-cols-[auto_1fr_auto] items-center w-full p-3 border border-b-[1px] leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        <div className="grid mr-4 place-items-center">
          <div className="flex items-center ">
            <div className="inline-flex items-center">
              <label
                className="relative flex items-center p-3 rounded-full cursor-pointer"
                htmlFor="amber"
              >
                <input
                  type="checkbox"
                  className="before:content[''] peer relative h-6 w-6 cursor-pointer appearance-none rounded-md border-[1.5px] border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-green-500 checked:bg-green-500 checked:before:bg-green-500 hover:before:opacity-10"
                  id="amber"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </label>
            </div>
          </div>
        </div>
        <div>
          <h6
            className={`${
              checked ? "line-through text-gray-400" : ""
            } block font-sans antialiased text-lg font-semibold leading-relaxed tracking-normal text-blue-gray-900`}
          >
            {todo?.name}
          </h6>
          <div className="flex gap-1 items-center">
            <p className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700">
              {normalDate}
            </p>
            <span
              className={`${determineColor(todo?.priority)} w-3 h-2 ms-2`}
            ></span>
          </div>
        </div>
        <div className="me-2">
          <button
            onClick={handleDelete}
            className="hover:bg-red-400 bg-transparent border-red-400 border-[1px] hover:text-white text-red-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      </li>
    </>
  );
};
// PropTypes
TodoItem.propTypes = {
  todo: PropTypes.object,
};

export default TodoItem;
