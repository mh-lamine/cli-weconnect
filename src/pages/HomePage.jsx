import { getProvidersByFilters } from "@/actions/providerActions";
import Error from "@/components/Error";
import ProviderCard from "@/components/ProviderCard";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import homeBg from "/home-bg.webp";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [providers, setProviders] = useState();
  const [filteredProviders, setFilteredProviders] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      const {data, error} = await getProvidersByFilters();
      setError(error);
      setProviders(data);
      setLoading(false);
    }
    fetchProviders();
  }, []);

  const filterProviders = async (e) => {
    const search = e.target.value.toLowerCase();
    const filteredProviders = providers.filter(
      (provider) =>
        provider?.name?.toLowerCase().includes(search) ||
        provider.address.toLowerCase().includes(search) ||
        provider.providerCategories.some((category) =>
          category.name.toLowerCase().includes(search)
        )
    );

    setFilteredProviders(filteredProviders);
  };

  const SkeletonList = Array.from({ length: 3 });

  if (error) {
    return <Error />;
  }

  const providersToDisplay = filteredProviders ?? providers;

  return (
    <main className="w-full flex flex-1 flex-col">
      <header className="relative flex flex-col h-1/3">
        <h1
          style={{
            fontFamily: "Source Serif Pro, serif",
          }}
          className="absolute inset-0 text-center font-semibold p-4 text-light top-[40%] text-[6vw]"
        >
          L'élégance à portée de main
        </h1>
        <img
          src={homeBg}
          alt="hair salon"
          className="aspect-video max-h-[50vh] w-full object-cover"
        />

        <div className="z-10 flex items-center gap-2 -mt-6 w-2/3 mx-auto h-12 px-4 shadow-sm rounded-md bg-white">
          <Search />
          <Input
            type="text"
            placeholder="Barber, Toulouse"
            className="border-0 focus-visible:ring-0 text-lg"
            onChange={filterProviders}
          />
        </div>
        <p className="text-muted text-sm text-center p-4">
          Recherchez un salon, une adresse ou type de prestation.
        </p>
      </header>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-lg mx-auto p-4">
        {loading
          ? SkeletonList.map((_, index) => <SkeletonProviderCard key={index} />)
          : providersToDisplay.map((provider, index) => (
              <li key={index}>
                <ProviderCard provider={provider} />
              </li>
            ))}
      </ul>
    </main>
  );
}

const SkeletonProviderCard = () => (
  <div>
    <Skeleton className="w-full aspect-video rounded-xl mb-2" />
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  </div>
);
