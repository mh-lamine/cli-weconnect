import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/utils/formatting";
import logo from "/weconnect_tinified.png";

export default function ProviderCard({ provider }) {
  const name = provider.name;
  return (
    <Link to={`provider/${provider.id}`} className="space-y-2">
      {provider.coverImage ? (
        <img
          src={provider.coverImage}
          alt="photo du salon"
          className=" rounded-xl w-full aspect-video object-cover"
        />
      ) : (
        <div className="w-full aspect-video bg-muted grid place-items-center text-light text-xl rounded-xl">
          <img src={logo} alt="weconnect logo" className="w-1/6" />
        </div>
      )}
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={provider.profilePicture} />
          <AvatarFallback className="text-lg">
            {name && getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h1 className="text-lg font-medium">{name}</h1>
          <p className="text-sm">{provider.address}</p>
        </div>
      </div>
    </Link>
  );
}
