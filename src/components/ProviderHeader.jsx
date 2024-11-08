import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatting";
import LeftArrow from "./svg/LeftArrow";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

export default function ProviderHeader({
  loading,
  name,
  address,
  profilePicture,
  coverImage,
}) {
  const navigate = useNavigate();
  return (
    <div
      className="hero w-full aspect-video relative max-h-[40vh] sm:max-h-[20vh]"
      style={{
        backgroundImage: `url("${coverImage && coverImage}")`,
      }}
    >
      <span
        className="absolute top-0 left-0 m-2 p-2 z-10"
        onClick={() => navigate("/")}
      >
        <LeftArrow theme={"light"} size={36} />
      </span>
      <div className="hero-overlay bg-opacity-40"></div>
      <div className="hero-content mt-auto mr-auto">
        <div className="flex items-center space-x-4">
          {loading ? (
            <>
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-8 w-[200px]" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="w-16 h-16">
                <AvatarImage src={profilePicture} />
                <AvatarFallback className="text-2xl">
                  {name && getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <h1 className="text-2xl font-semibold bg-muted px-2 py-1 rounded-sm w-fit">
                  {name}
                </h1>
                <p className="bg-muted px-2 py-1 rounded-sm w-fit">{address}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
