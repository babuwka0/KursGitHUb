import http from "../http-common";

function login(username, password) {
  return http.post("/auth/signin", { username, password }).then((res) => {
    if (res.data.token) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res.data;
  });
}

function logout() {
  localStorage.removeItem("user");
}

function register(username, password, role) {
  return http.post("/auth/signup", { username, password, role });
}

export default { login, logout, register };
