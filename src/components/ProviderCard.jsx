import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import Tag from "./Tag";

export default function ProviderCard({ provider }) {
  return (
    <div className="gap-2 grid grid-cols-5 md:grid-cols-3">
      {/* <img src="" alt="photo du salon" /> */}
      <div className="bg-muted grid place-items-center text-light text-xs col-span-2 md:col-span-1">
        no photo
      </div>
      <div className="p-2 flex flex-col justify-around col-span-3 md:col-span-2">
        <div>
          <h1>{provider.providerName}</h1>
          <p className="text-sm flex-wrap">{provider.address}</p>
          <div className="flex whitespace-nowrap overflow-x-auto no-scrollbar items-center gap-1 py-2">
            {provider.providerCategories.map((category, index) => (
              <Tag key={index} name={category.name} />
            ))}
          </div>
        </div>
        <Button asChild className="w-fit ml-auto">
          <Link to={`providers/${provider.id}`}>Voir le salon</Link>
        </Button>
      </div>
    </div>
  );
}
