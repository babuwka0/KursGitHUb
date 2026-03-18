import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));
const token = user?.token || "";

export default axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
});
