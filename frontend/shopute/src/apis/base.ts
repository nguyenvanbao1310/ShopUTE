import axios from 'axios';
// import {store} from '../store/store';
const BASE_URL = "http://localhost:8088/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,           
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token"); 
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export { BASE_URL, api };