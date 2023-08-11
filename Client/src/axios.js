import axios from "axios";

const storedToken = localStorage.getItem("accessToken");
const accessToken = JSON.parse(storedToken); 

export const makeRequest = axios.create({
  baseURL: "https://cloud-server.cyclic.app/api",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});


// Set up a request interceptor to update the Authorization header
makeRequest.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(storedToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
