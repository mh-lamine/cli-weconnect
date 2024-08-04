import axios from "@/api/axios";

const REGISTER_URL = "/auth/register";
const LOGIN_URL = "/auth/login";

export async function handleRegister(credentials) {
  return await axios.post(REGISTER_URL, JSON.stringify(credentials), {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
}

export async function handleLogin(credentials) {
  const response = await axios.post(LOGIN_URL, credentials, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response?.data;
}
