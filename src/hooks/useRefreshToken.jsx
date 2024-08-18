import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/api/auth/refresh", {
        withCredentials: true,
      });

      setAuth((prev) => ({
        ...prev,
        accessToken: response.data.accessToken,
      }));

      return response.data.accessToken;
    } catch (error) {
      console.error("error", error);
    }
  };

  return refresh;
};

export default useRefreshToken;
