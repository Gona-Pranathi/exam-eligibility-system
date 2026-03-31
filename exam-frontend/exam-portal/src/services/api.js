import axios from "axios";

const API = axios.create({
  baseURL:"https://exam-eligibility-system.onrender.com/"
});

export default API;