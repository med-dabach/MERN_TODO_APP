export const baseUrl = "http://192.168.0.111:8000";

export const signup = async (user, email, pwd, setErr, setLoading) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName: user, email, password: pwd }),
    credentials: "include",
  };
  try {
    setLoading(true);
    const responcee = await fetch(baseUrl + "/user", options);
    if (!responcee.ok) throw responcee;
    return await responcee.json();
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      return setErr({ response: "UserName or Password Required!!" });
    } else if (error.status === 409) {
      return setErr({ response: "This userName is taken" });
    } else if (error.status === 500) {
      return setErr({ response: "Server error" });
    } else {
      return setErr({ response: "No response from server" });
    }
  } finally {
    setLoading(false);
  }
};
let controller;
export const login = async (user, pwd, setErr, setLoading) => {
  if (controller) controller.abort();

  controller = new AbortController();

  const signal = controller?.signal;
  setLoading(true);
  const loginOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: user,
      password: pwd,
    }),
    signal,
    // allow data to be sent with cookies
    credentials: "include",
  };

  try {
    const response = await fetch(baseUrl + "/login", loginOptions);
    if (!response.ok) throw response;
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error(error);
    if (error.status === 400) {
      return setErr({ response: "UserName or Password Required!!" });
    } else if (error.status === 401) {
      return setErr({ response: "Invalid username or password" });
    } else if (error.status === 500) {
      return setErr({ response: "Server error" });
    } else {
      return setErr({ response: "No response from server" });
    }
  } finally {
    setLoading(false);
  }
};

export const logout = () => {
  return fetch(baseUrl + "/logout", {
    method: "GET",
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

export const getPasswordReset = (email, setErr) => {
  return fetch(baseUrl + "/passwordreset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      if (error.status === 400) {
        setErr({ response: "Email Required!!" });
      } else if (error.status === 404) {
        setErr({ response: "Email not found" });
      } else if (error.status === 500) {
        setErr({ response: "Server error" });
      } else {
        setErr({ response: "No response from server" });
      }
      console.error(error);
    });
};

export const newPassword = (newPassword, token, email, setErr) => {
  return fetch(baseUrl + "/passwordreset", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword, email, token }),
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      if (error.status === 400) {
        setErr({ response: "Token, Email or New Password Required!!" });
      } else if (error.status === 401) {
        setErr({ response: "Expired or Invalid token" });
      } else if (error.status === 500) {
        setErr({ response: "Server error" });
      } else {
        setErr({ response: "No response from server" });
      }
      console.error(error);
    });
};
