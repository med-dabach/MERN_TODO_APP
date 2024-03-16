import { baseUrl } from "./auth";

export const getTodos = (page, navigate) => {
  return fetch(
    baseUrl +
      "/todo?fields=name,isDone,createdAt,id,priority" +
      "&page=" +
      page,
    {
      method: "GET",
      credentials: "include",
    }
  )
    .then((res) => {
      if (res.status === 401) {
        return navigate("/login");
      }
      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error(error);
    });
};

export const addTodo = (todo, setLoading) => {
  setLoading(true);
  return fetch(baseUrl + "/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
    credentials: "include",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error(error);
    })
    .finally(() => setLoading(false));
};

export const deleteTodo = (id) => {
  return fetch(baseUrl + "/todo/" + id, {
    method: "DELETE",
    credentials: "include",
  })
    .then((res) => {
      if (res.status === 204) return true;
      else return false;
    })
    .then((data) => data)
    .catch((error) => {
      console.error(error);
    });
};

export const updateTodo = (todo) => {
  // console.log(todo._id);
  return fetch(baseUrl + "/todo/" + todo?._id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
    credentials: "include",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error(error);
    });
};
