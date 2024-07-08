import { useDispatch, useSelector } from "react-redux";
import Option from "../components/OptionSelect";
import InnerNav from "../components/innerNav";
import TodoItem from "../components/todoItem";
import {
  errorSelector,
  todosLimitSelector,
  todosPageSelector,
  todosResultsCountSelector,
  todosSelector,
  todosShowingFrom,
  todosShowingTo,
  userSelector,
} from "../redux/selectors";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { addTodo, getTodos } from "../api/fetching";
import { setTodos, setPage } from "../redux/slices/todoSlice";

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const todos = useSelector(todosSelector);
  const authError = useSelector(errorSelector);
  const todosFrom = useSelector(todosShowingFrom);
  const todosTo = useSelector(todosShowingTo);
  const todosLimit = useSelector(todosLimitSelector);
  // const todosLength = useSelector(todosLengthSelector);
  const todosResultsCount = useSelector(todosResultsCountSelector);
  const todosPage = useSelector(todosPageSelector);
  const [filter, setFilter] = useState("default");

  // console.log(useSelector((state) => state));
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [loadingTodos, setLoadingTodos] = useState(false);

  useEffect(() => {
    if (authError) {
      navigate("/login");
    }
  }, [authError, navigate]);

  useEffect(() => {
    setError({});
  }, [newTodo, priority]);

  const fetchTodos = useCallback(async () => {
    const result = await getTodos(todosPage, navigate, setLoadingTodos);
    dispatch(setTodos(result));
  }, [dispatch, navigate, todosPage]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!newTodo || !priority) {
      if (!newTodo) {
        setError((prev) => ({ ...prev, todoName: "Please enter a todo" }));
      } else if (!priority) {
        setError((prev) => ({ ...prev, priority: "Please select a priority" }));
      }
      return;
    } else {
      setError({});
      await addTodo({ name: newTodo, priority }, setLoading);

      fetchTodos();
      setNewTodo("");
      setPriority("");
    }
  };
  const filterTodos = () => {
    if (filter === "default") return todos;
    if (filter === "complete") return todos.filter((todo) => todo.isDone);
    if (filter === "incomplete") return todos.filter((todo) => !todo.isDone);
    if (filter === "low")
      return todos.filter((todo) => todo.priority === "low");
    if (filter === "medium")
      return todos.filter((todo) => todo.priority === "medium");
    if (filter === "high")
      return todos.filter((todo) => todo.priority === "high");
  };

  const filterd = filterTodos();

  const displayTodos = () =>
    filterd?.length > 0 && !loadingTodos ? (
      filterd.map((todo) => <TodoItem key={todo?._id} todo={todo} />)
    ) : (
      <p className="text-center text-gray-300">No todos found</p>
    );

  const handleNextPage = () => {
    dispatch(setPage(todosPage + 1));
  };
  const handlePrevPage = () => {
    dispatch(setPage(todosPage - 1));
  };
  return (
    <>
      <InnerNav user={user} />
      <div>
        <div>
          <div className="bg-green-500 min-h-[300px]  flex-col flex items-center justify-center gap-10">
            <h1 className="text-white text-3xl font-bold ">Todo App</h1>
            <form className="  max-w-[600px] mx-auto max-sm:flex flex-wrap sm:gap-0 gap-3 sm:p-0 p-2 sm:grid h-fit grid-cols-[1fr_auto_auto]">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`${
                  error && error?.priority
                    ? "border-red-500 border-[1.5px]"
                    : ""
                } bg-green-50 order-2  border float-end border-gray-300 text-gray-900 text-sm  focus:ring-green-500 focus:border-green-500 block w-full p-2.5`}
              >
                <Option value="">select priority</Option>
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </select>
              <input
                className={`${
                  error && error?.todoName
                    ? "border-red-500 border-[1.5px]"
                    : ""
                } shadow appearance-none border order-1 rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline`}
                id="todo"
                type="text"
                placeholder="Add Todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />

              <button
                onClick={handleClick}
                disabled={loading}
                className="disabled:opacity-55 bg-green-500 block order-3 border-white border-[1.2px] disabled:bg-green-300 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Todo
              </button>
            </form>
          </div>
          <div className="container">
            <h3 className="text-center mb-5 mt-2 text-2xl text-gray-500 font-bold">
              Your Task List
            </h3>
            <div className=" max-w-[500px] m-auto px-2 flex  ">
              <form className="max-w-[150px]">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-green-50 border float-end border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                >
                  <Option value="default">Default</Option>
                  <Option value="complete">Complete</Option>
                  <Option value="incomplete">Incomplete</Option>
                  <Option value="low">Priority: Low</Option>
                  <Option value="medium">Priority: Medium</Option>
                  <Option value="high">Priority: High</Option>
                </select>
              </form>
            </div>

            <ul className="flex min-w-[240px] max-w-[500px] w-full m-auto flex-col gap-1 p-2 font-sans text-base font-normal text-green-gray-700">
              {displayTodos()}
              {loadingTodos && <p className="text-center">Loading...</p>}
            </ul>
            {/* </div> */}
            {/*  */}
            {filterd && (
              <div className="flex  flex-col items-center gap-3 mt-5">
                {" "}
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Showing from
                  <span className="font-semibold text-gray-900">
                    {" "}
                    {todosFrom + 1} to
                  </span>
                  <span className="font-semibold text-gray-900">
                    {" "}
                    {todosTo}
                  </span>{" "}
                  of
                  <span className="font-semibold text-gray-900">
                    {" "}
                    {todosResultsCount}
                  </span>{" "}
                  Entries
                </span>
                <div className="flex justify-center">
                  <button
                    disabled={todosPage - 1 === 0}
                    onClick={handlePrevPage}
                    className={`disabled:opacity-55 flex items-center justify-center px-4 h-10 me-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:textgray-700`}
                  >
                    <svg
                      className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Previous
                  </button>
                  <button
                    disabled={
                      Math.floor(todosResultsCount / todosLimit + 1) ===
                      todosPage
                    }
                    onClick={handleNextPage}
                    className={`disabled:opacity-55 flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700`}
                  >
                    Next
                    <svg
                      className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {/*  */}
            <footer className="bg-white rounded-lg shadow m-4">
              <div className="flex items-center justify-between px-5 py-4">
                {/* <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" /> */}
                <span className="block text-sm text-gray-500 sm:text-center ">
                  © 2024{" "}
                  <a
                    href="https://www.linkedin.com/in/2001-mohamed-dabach/"
                    target="blank"
                    className="hover:underline"
                  >
                    Dabach
                  </a>
                  . All Rights Reserved.
                </span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
