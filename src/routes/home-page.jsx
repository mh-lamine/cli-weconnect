import { getProvidersByFilters } from "@/actions/providerActions";
import ProviderCard from "@/components/ProviderCard";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [providers, setProviders] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchProviders() {
      try {
        const data = await getProvidersByFilters();
        setProviders(data);
      } catch {
        setError(data.error);
      }
      setLoading(false);
    }
    fetchProviders();
  }, []);

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  if (error) {
    return <div className="flex-1">Error: {error}</div>;
  }

  return (
    <main className="w-full flex flex-1 flex-col p-4">
      <ul className="space-y-2 w-full max-w-screen-lg mx-auto">
        {providers?.map((provider, index) => (
          <li key={index} className="rounded-xl shadow overflow-hidden">
            <ProviderCard provider={provider} />
          </li>
        ))}
      </ul>
    </main>
  );
}
