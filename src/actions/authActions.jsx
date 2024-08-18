import axios from "axios";

const REGISTER_URL = "/api/auth/register";
const LOGIN_URL = "/api/auth/login";

export async function handleRegister(credentials) {
  return await axios.post(REGISTER_URL, JSON.stringify(credentials), {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
}

export async function handleLogin(credentials) {
  return await axios.post(LOGIN_URL, credentials, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
}
