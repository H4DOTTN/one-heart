import axios from "axios"

const PublicAPI = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
})

// now we use one with credentials
const PrivateAPI = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export { PublicAPI as publicAxios, PrivateAPI as privateAxios }
