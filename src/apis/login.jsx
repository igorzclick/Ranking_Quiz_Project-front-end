import axios from "axios";

// base api
const API_URL = "/api";

// axios config - inclui token nas req de autenticação
const api = axios.create({
  baseURL: API_URL,
});

// add token de autenticacao nas req
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// login
export async function loginUser({ nickname, password }) {
  try {
    const response = await api.post("/auth/login", {
      nickname,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// cadastro
export async function registerUser({ nickname, email, password }) {
  try {
    const response = await api.post("/player/register", {
      nickname,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// verifica autenticacao
export function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

// retornar token
export function getToken() {
  return localStorage.getItem("token");
}

// sair
export function logout() {
  localStorage.removeItem("token");
}
