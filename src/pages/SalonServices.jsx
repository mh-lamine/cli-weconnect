import Error from "@/components/Error";
import ModalAddCategory from "@/components/modal/ModalAddCategory";
import ModalAddService from "@/components/modal/ModalAddService";
import ModalRemoveService from "@/components/modal/ModalRemoveService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SalonServices = () => {
  const [categories, setCategories] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await axiosPrivate.get("/api/providerCategory/me");
      setCategories(response.data);
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setLoading(false);
  }

  async function createService(service) {
    await axiosPrivate.post("/api/providerService", service);
    getCategories();
  }

  async function createCategory(category) {
    await axiosPrivate.post("/api/providerCategory", category);
    getCategories();
  }

  async function removeService(id) {
    await axiosPrivate.delete(`/api/providerService/${id}`);
    getCategories();
  }

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col space-y-4">
      <Button
        variant="link"
        className="justify-start h-0 p-0"
        onClick={() => navigate(-1)}
      >
        Retour
      </Button>
      <div>
        <h1 className="text-3xl font-semibold">Mes prestations</h1>
        <ModalAddCategory createCategory={createCategory} />
      </div>
      {categories?.map((category, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">{category.name}</h2>
            <ModalAddService
              providerCategoryId={category.id}
              createService={createService}
            />
          </div>
          <ul className="space-y-2">
            {category.services.map((service) => (
              <li
                key={service.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="w-full rounded-md p-4 pr-0 bg-gray-100">
                  <div className="flex items-center justify-between">
                    <p>{service.name}</p>
                    <div className="flex items-center">
                      <p>{service.duration}mn</p>
                      <div className="divider divider-horizontal" />
                      <p>{service.price}€</p>
                      <ModalRemoveService
                        id={service.id}
                        removeService={removeService}
                      />
                    </div>
                  </div>
                  <p>{service.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
};

export default SalonServices;
