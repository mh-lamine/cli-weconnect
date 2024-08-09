import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function Header() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axiosPrivate.get("/users");
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    getUser();
  }, []);

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Navbar */}
        <div className="navbar text-primary-800 bg-light shadow-sm w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
            <Link to={"/"} className="text-xl font-semibold">
              WeConnect
            </Link>
          </div>
          <div className="hidden lg:flex items-center justify-between w-full px-4">
            <Link to={"/"} className="text-xl font-semibold">
              WeConnect
            </Link>
            <div className="flex items-center gap-2">
              {loading ? null : user ? (
                <>
                  {user?.isProvider && (
                    <Button asChild>
                      <Link to={"dashboard"}>Mon tableau de bord</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <Link to={"account"}>Mon compte</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant={"outline"}>
                    <Link to={"register"}>Créer un compte</Link>
                  </Button>
                  <Button asChild>
                    <Link to={"login"}>Se connecter</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-side z-10">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="text-primary-800 bg-light shadow-sm min-h-full w-80 p-8 flex flex-col">
          <Link to={"/"} className="text-xl font-semibold">
            WeConnect
          </Link>
          {/* Sidebar content here */}
          <ul className="mt-8 space-y-2">
            <li>Barber</li>
            <li>Estheticienne</li>
          </ul>
          <div className="w-full flex flex-col items-center gap-2 mt-auto">
            {loading ? null : user ? (
              <>
                {user?.isProvider && (
                  <Button asChild>
                    <Link to={"dashboard"} className="w-full">
                      Mon tableau de bord
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link to={"account"} className="w-full">
                    Mon compte
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant={"outline"}>
                  <Link to={"register"} className="w-full">
                    Créer un compte
                  </Link>
                </Button>
                <Button asChild>
                  <Link to={"login"} className="w-full">
                    Se connecter
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
