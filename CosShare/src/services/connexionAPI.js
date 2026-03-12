import axios from 'axios';

const API_URL = axios.create({
    baseURL: "http://localhost:3000/api",

    headers: {
        "Content-Type": "application/json",
    },

});

API_URL.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API_URL;