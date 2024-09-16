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
      // style={{
      //   backgroundImage: `url(${coverImage && coverImage[0]})`,
      // }}
    >
      <span
        className="absolute top-0 left-0 m-2 p-2 z-10"
        onClick={() => navigate(-1)}
      >
        <LeftArrow theme={"light"} size={36} />
      </span>
      <div className="hero-overlay bg-opacity-40"></div>
      <div className="hero-content text-neutral-content mt-auto mr-auto">
        <div className="flex items-center space-x-4">
          {loading ? (
            <>
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="w-14 h-14">
                <AvatarImage src={profilePicture} />
                <AvatarFallback className="text-xl">
                  {name && getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <h1 className="text-3xl font-semibold">{name}</h1>
                <p>{address}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
