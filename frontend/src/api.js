import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const getBooks = (params = {}) => {
  return api.get("/books/", { params });
};

export const createBook = (book) => {
  return api.post("/books/", book);
};

export const updateBook = (id, book) => {
  return api.put(`/books/${id}/`, book);
};

export const deleteBook = (id) => {
  return api.delete(`/books/${id}/`);
};

export default api;