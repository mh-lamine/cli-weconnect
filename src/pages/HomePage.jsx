import { getProvidersByFilters } from "@/actions/providerActions";
import Error from "@/components/Error";
import ProviderCard from "@/components/ProviderCard";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import homeBg from "/home-bg.jpg";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [providers, setProviders] = useState();
  const [filteredProviders, setFilteredProviders] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      const response = await getProvidersByFilters();
      setError(response.error);
      setProviders(response.data);
      setLoading(false);
    }
    fetchProviders();
  }, []);

  const filterProviders = async (e) => {
    const search = e.target.value.toLowerCase();
    const filteredProviders = providers.filter(
      (provider) =>
        provider?.providerName?.toLowerCase().includes(search) ||
        provider.address.toLowerCase().includes(search) ||
        provider.providerCategories.some((category) =>
          category.name.toLowerCase().includes(search)
        )
    );

    setFilteredProviders(filteredProviders);
  };

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  if (error) {
    return <Error />;
  }

  const providersToDisplay = filteredProviders ?? providers;

  return (
    <main className="w-full flex flex-1 flex-col">
      <header className="flex flex-col h-1/3">
        <img
          src={homeBg}
          alt="hair salon"
          className="max-h-[50vh] w-full object-cover"
        />
        <div className="flex items-center gap-2 -mt-6 w-2/3 mx-auto h-12 px-4 shadow-sm rounded-md bg-white">
          <Search />
          <Input
            type="text"
            placeholder="Barber, Toulouse"
            className="border-0 focus-visible:ring-0 text-lg"
            onChange={filterProviders}
          />
        </div>
        <p className="text-muted text-sm mx-auto my-2">
          Recherchez un salon, une adresse ou type de prestation.
        </p>
      </header>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-screen-lg mx-auto  p-4">
        {providersToDisplay.map((provider, index) => (
          <li
            key={index}
            className="rounded-xl bg-dark/5 shadow  overflow-hidden"
          >
            <ProviderCard provider={provider} />
          </li>
        ))}
      </ul>
    </main>
  );
}
