import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const Admin = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const makeProvider = async () => {
    setLoading(true);
    try {
      await axiosPrivate.patch("/api/users/admin", data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return auth.phoneNumber !== "0768580893" ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    <div>
      <h1>Admin Page</h1>
      <Input name="userPhoneNumber" type="number" onChange={handleChange} />
      <Input name="password" type="password" onChange={handleChange} />
      <Button onClick={makeProvider}>
        {loading ? "Loading..." : "Make Provider"}
      </Button>
    </div>
  );
};

export default Admin;
