import axios from "axios";
import API from "../config/apis";

const http = axios.create({
  baseURL: API.MASTER_SERVICE,
  headers: {
    "Content-type": "application/json"
  }
});


export {http};
