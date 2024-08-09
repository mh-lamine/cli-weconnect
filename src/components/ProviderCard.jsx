import { Link } from "react-router-dom";
import Tag from "./Tag";

export default function ProviderCard({ provider }) {
  return (
    <Link to={`provider/${provider.id}`}>
      {/* <img src="" alt="photo du salon" /> */}
      <div className="bg-muted grid place-items-center h-40 text-light text-xs">
        no photo
      </div>
      <div className="p-2 flex flex-col justify-around">
        <div>
          <h1>{provider.providerName}</h1>
          <p className="text-sm flex-wrap">{provider.address}</p>
          <div className="flex whitespace-nowrap overflow-x-auto no-scrollbar items-center gap-1 py-2">
            {provider.providerCategories.map((category, index) => (
              <Tag key={index} name={category.name} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
