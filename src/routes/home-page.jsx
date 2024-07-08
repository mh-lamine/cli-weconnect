import ProviderCard from "@/components/ProviderCard";
import React from "react";
import { useLoaderData } from "react-router-dom";

export default function HomePage() {
  const providers = useLoaderData();

  return (
    <main className="w-full flex flex-1 flex-col p-4">
      <ul className="space-y-2 w-full max-w-screen-lg mx-auto">
        {providers.map((provider, index) => (
          <li key={index} className="rounded-xl shadow overflow-hidden">
            <ProviderCard provider={provider} />
          </li>
        ))}
      </ul>
    </main>
  );
}
