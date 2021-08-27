import axios from "axios";

const API = axios.create({ baseURL: "https://sleep-tracking.herokuapp.com" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
export const fetchEntries = () => API.get("/entry");
export const createEntry = (newEntry) => API.post("/entry", newEntry);
export const updateEntry = (id, updatedEntry) =>
  API.patch(`/entry/${id}`, updatedEntry);
export const deleteEntry = (id) => API.delete(`/entry/${id}`);
