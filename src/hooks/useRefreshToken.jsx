import useAuth from "./useAuth";
import axios from "@/api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });

      setAuth({
        accessToken: response.data.accessToken,
        isProvider: response.data.isProvider,
      });

      return response.data.accessToken;
    } catch (error) {
      console.error("error", error);
    }
  };

  return refresh;
};

export default useRefreshToken;
