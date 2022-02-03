import axios from "axios";

const instance = axios.create({
  baseURL: "https://travellogblog.herokuapp.com/api/",
});

export default instance;
