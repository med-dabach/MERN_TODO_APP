import { baseUrl } from "./auth";

export const getTodos = async (page, navigate, setLoading) => {
  setLoading(true);
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
      if (res.ok) return res.json();
      throw res;
    })
    .then((data) => data)
    .catch((error) => {
      if (error.status === 401) return navigate("/login");
      console.error(error);
    })
    .finally(() => setLoading(false));
};

export const addTodo = async (todo, setLoading) => {
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
      return res.ok;
    })
    .then((data) => data)
    .catch((error) => {
      console.error(error);
    })
    .finally(() => setLoading(false));
};

export const deleteTodo = (id, setLoading) => {
  setLoading(true);
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
    })
    .finally(() => setLoading(false));
};

export const updateTodo = (todo, setLoading) => {
  setLoading(true);
  return fetch(baseUrl + "/todo/" + todo?._id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
    credentials: "include",
  })
    .then((res) => {
      return res.ok;
    })
    .then((data) => data)
    .catch((error) => {
      console.error(error);
    })
    .finally(() => setLoading(false));
};
