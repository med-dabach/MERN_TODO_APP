export const baseUrl = "http://192.168.0.111:8000";
export const signup = (user, email, pwd, setErr) => {
  return fetch(baseUrl + "/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName: user, email, password: pwd }),
    credentials: "include",
  })
    .then((res) => {
      if (res.status === 201) {
        return res.json();
      } else if (res.status === 400) {
        setErr({ response: "UserName or Password Required!!" });
      } else if (res.status === 500) {
        setErr({ response: "Server error" });
      } else {
        setErr({ response: "No response from server" });
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    });
};

export const login = (user, pwd, setErr) => {
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
    // allow data to be sent with cookies
    credentials: "include",
  };
  return fetch(baseUrl + "/login", loginOptions)
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      error.json().then(() => {
        if (error.status === 400) {
          setErr({ response: "UserName or Password Required!!" });
        } else if (error.status === 401) {
          setErr({ response: "Invalid username or password" });
        } else if (error.status === 500) {
          setErr({ response: "Server error" });
        } else {
          setErr({ response: "No response from server" });
        }
      });
    });
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
