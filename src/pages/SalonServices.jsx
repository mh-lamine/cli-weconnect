import ModalAddCategory from "@/components/modal/ModalAddCategory";
import ModalAddService from "@/components/modal/ModalAddService";
import ModalDisableCategory from "@/components/modal/ModalDisableCategory";
import ModalDisableService from "@/components/modal/ModalDisableService";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SalonServices = () => {
  const [categories, setCategories] = useState();
  const [apiError, setApiError] = useState();
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
      setCategories(response.data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        setError(error);
      }
    }
    setLoading(false);
  }

  async function createService(service) {
    try {
      await axiosPrivate.post("/api/providerService", service);
      getCategories();
    } catch (error) {
      setApiError(error);
    }
  }

  async function createCategory(category) {
    try {
      await axiosPrivate.post("/api/providerCategory", category);
      getCategories();
    } catch (error) {
      setApiError(error);
    }
  }

  async function enableCategory(id) {
    try {
      await axiosPrivate.put(`/api/providerCategory/${id}`, { isActive: true });
      getCategories();
    } catch (error) {
      setApiError(error);
    }
  }

  async function enableService(id) {
    try {
      await axiosPrivate.put(`/api/providerService/${id}`, { isActive: true });
      getCategories();
    } catch (error) {
      setApiError(error);
    }
  }

  async function disableCategory(id) {
    try {
      await axiosPrivate.put(`/api/providerCategory/${id}`, {
        isActive: false,
      });
      getCategories();
    } catch (error) {
      setApiError(error);
    }
  }

  async function disableService(id, providerCategoryId) {
    try {
      await axiosPrivate.put(`/api/providerService/${id}`, {
        isActive: false,
        providerCategoryId,
      });
      getCategories();
    } catch (error) {
      setApiError(error);
    }
  }

  //FIXME: display apiError in a toast

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
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
      {categories?.map(
        (category) =>
          category.isActive && (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium">{category.name}</h2>
                <div>
                  <ModalAddService
                    providerCategoryId={category.id}
                    createService={createService}
                  />
                  <ModalDisableCategory
                    id={category.id}
                    name={category.name}
                    disableCategory={disableCategory}
                  />
                </div>
              </div>
              <ul className="space-y-2">
                {category.services.map(
                  (service) =>
                    service.isActive && (
                      <li
                        key={service.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="w-full rounded-md p-4 pr-0 bg-gray-100">
                          <div className="flex items-start justify-between gap-10">
                            <div>
                              <h3 className="text-xl">{service.name}</h3>
                              <p>{service.description}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center">
                                <p>{service.duration}mn</p>
                                <div className="divider divider-horizontal" />
                                <p>{service.price}€</p>

                                <ModalDisableService
                                  id={service.id}
                                  providerCategoryId={category.id}
                                  disableService={disableService}
                                />
                              </div>
                              <ModalDisableService
                                id={service.id}
                                providerCategoryId={category.id}
                                disableService={disableService}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                )}
              </ul>
            </div>
          )
      )}
      <div className="divider divider-start text-muted">Inactives</div>
      {categories.map((category) => {
        const hasInactiveServices = category.services.some(
          (service) => !service.isActive
        );

        return (
          (hasInactiveServices || !category.isActive) && (
            <div key={category.id} className="space-y-2 text-muted">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium">{category.name}</h2>
                {!category.isActive && (
                  <Button
                    variant="link"
                    onClick={() => enableCategory(category.id)}
                  >
                    Activer la catégorie
                  </Button>
                )}
              </div>
              <ul className="space-y-2">
                {category.services.map(
                  (service) =>
                    (!service.isActive || !category.isActive) && (
                      <li
                        key={service.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="w-full rounded-md p-4 bg-gray-100">
                          <div className="flex items-center justify-between">
                            <p>{service.name}</p>
                            {category.isActive && !service.isActive && (
                              <Button
                                variant="link"
                                onClick={() => enableService(service.id)}
                              >
                                Activer le service
                              </Button>
                            )}
                            {!category.isActive && (
                              <div className="flex items-center">
                                <p>{service.duration}mn</p>
                                <div className="divider divider-horizontal" />
                                <p>{service.price}€</p>
                              </div>
                            )}
                          </div>
                          <p>{service.description}</p>
                        </div>
                      </li>
                    )
                )}
              </ul>
            </div>
          )
        );
      })}
    </main>
  );
};

export default SalonServices;
