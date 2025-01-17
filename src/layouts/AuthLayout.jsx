import { Outlet } from "react-router-dom";
import RandomQuotes from "@/components/RandomQuotes";

const AuthLayout = () => {
  return (
    <main className="w-screen min-h-screen flex flex-col lg:flex-row bg-primary-500 text-dark">
      <div className="h-[25vh] p-4 lg:w-1/2 max-w-[500px] mx-auto lg:h-screen grid place-items-center">
        <RandomQuotes />
      </div>
      <div className="bg-light flex-1 lg:flex-none lg:w-1/2 grid place-items-center rounded-t-3xl lg:rounded-3xl lg:m-4">
        <div className="w-full lg:shadow-none grid place-items-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
