import ProviderCard from "@/components/ProviderCard";
import React from "react";
import { useLoaderData } from "react-router-dom";

export default function HomePage() {
  const providers = useLoaderData();

  return (
    <main className="w-full flex flex-1 flex-col p-4">
      <ul className="space-y-2">
        {providers.map((provider) => (
          <li key={provider.id} className="rounded-xl shadow overflow-hidden">
            <ProviderCard key={provider.id} provider={provider} />
          </li>
        ))}
      </ul>
    </main>
  );
}
