import { Link, Outlet } from "react-router-dom";
import logo from "/weconnect.png";
const AuthLayout = () => {
  return (
    <main className="w-screen h-screen flex flex-col lg:flex-row bg-light text-dark">
      <div className="w-full h-1/2 lg:w-1/2 lg:h-screen grid place-items-center bg-primary-500">
        <Link to={"/"}>
          <img src={logo} alt="logo weconnect" className="w-80 -mt-20" />
        </Link>
        <span className="absolute bottom-10">
          &copy; 2024 WeConnect Inc. Tous droits réservés.
        </span>
      </div>
      <div className="w-full h-1/2 lg:h-full lg:w-1/2 grid place-items-center">
        <div className="w-3/4 h-fit py-8 grid place-items-center bg-white -mt-60 rounded-xl shadow lg:mt-0 lg:bg-light lg:w-full lg:shadow-none">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
