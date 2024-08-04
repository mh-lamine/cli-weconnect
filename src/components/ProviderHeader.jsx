import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatting";
import LeftArrow from "./svg/LeftArrow";
import { useNavigate } from "react-router-dom";

export default function ProviderHeader({ name, address }) {
  const navigate = useNavigate();
  return (
    <div
      className="hero w-full aspect-video relative max-h-[40vh] sm:max-h-[20vh]"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1619607146034-5a05296c8f9a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <span
        className="absolute top-0 left-0 m-2 p-2"
        onClick={() => navigate(-1)}
      >
        <LeftArrow theme={"light"} size={36} />
      </span>
      <div className="hero-overlay bg-opacity-40"></div>
      <div className="hero-content text-neutral-content mt-auto mr-auto">
        <div className="flex items-center p-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src="" />
            <AvatarFallback className="text-xl">
              {name && getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h1 className="text-3xl font-semibold">{name}</h1>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
