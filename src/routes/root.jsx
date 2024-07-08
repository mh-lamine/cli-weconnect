import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function Root() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-between bg-light text-dark">
      <Header />
      <Outlet />
      <Footer />
      <Toaster />
    </div>
  );
}
