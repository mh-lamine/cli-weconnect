import { Link, Outlet } from "react-router-dom";
import logo from "/weconnect.png";
const AuthLayout = () => {
  return (
    <main className="w-screen min-h-screen flex flex-col lg:flex-row bg-light text-dark">
      <div className="w-full h-[50vh] lg:w-1/2 lg:h-screen bg-primary-500 grid place-items-center">
        <Link to={"/"}>
          <img
            src={logo}
            alt="logo weconnect"
            className="w-60 -mt-20 lg:mt-0"
          />
        </Link>
      </div>
      <div className="w-full lg:w-1/2 grid place-items-center">
        <div className="w-3/4 h-fit py-8 grid place-items-center bg-white rounded-xl shadow -mt-28 lg:mt-0 lg:bg-light lg:w-full lg:shadow-none">
          <Outlet />
        </div>
        <div className="bottom-0 py-4 text-center lg:w-1/2 w-full lg:right-0 lg:absolute">
          &copy; 2024 WeConnect Inc. Tous droits réservés.
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
