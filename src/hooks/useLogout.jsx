import axios from "axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const logout = async () => {
    setAuth(null);
    try {
      await axios.get("/api/auth/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return logout;
};

export default useLogout;
