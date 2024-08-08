import { Link, Outlet } from "react-router-dom";
import logo from "/weconnect.png";
import mini_logo from "/weconnect_tinified.png";
const AuthLayout = () => {
  return (
    <main className="w-screen min-h-screen flex bg-light text-dark">
      <div className="hidden lg:block w-1/2 h-screen  bg-primary-500">
        <div className="w-full h-full grid place-items-center">
          <img src={logo} alt="logo weconnect" className="w-80 " />
          <span className="absolute bottom-10">
            &copy; 2024 WeConnect Inc. Tous droits réservés.
          </span>
        </div>
      </div>
      <div className="relative w-full lg:w-1/2 flex items-center justify-center">
        <Link to="/">
          <img
            src={mini_logo}
            alt="logo weconnect"
            className="absolute top-0 left-0 w-16 h-16 m-8"
          />
        </Link>
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
