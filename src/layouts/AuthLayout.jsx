import { Outlet } from "react-router-dom";
import logo from "/weconnect.png";
const AuthLayout = () => {
  return (
    <main className="w-screen min-h-screen flex bg-light text-dark">
      <div className="hidden lg:block w-1/2 h-screen  bg-primary-500">
        <div className="w-full h-full grid place-items-center">
          <img src={logo} alt="logo weconnect" className="w-80 " />
          <span className="absolute bottom-10">&copy; 2024 WeConnect Inc. Tous droits réservés.</span>
        </div>
      </div>
      <div className="w-full lg:w-1/2 grid place-items-center">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
