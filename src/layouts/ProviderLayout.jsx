import { Toaster } from '@/components/ui/toaster';
import { Outlet } from 'react-router-dom';

export default function ProviderLayout() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-between bg-light text-dark">
      <Outlet />
      <Toaster />
    </div>
  );
}
