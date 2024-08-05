import useAuth from "./useAuth";
import axios from "@/api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });

      setAuth((prev) => {
        console.log("prev", prev);
        console.log("response", response.data.accessToken);
        return {
          ...prev,
          accessToken: response.data.accessToken,
        };
      });

      return response.data.accessToken;
    } catch (error) {
      console.error("error", error);
    }
  };

  return refresh;
};

export default useRefreshToken;
