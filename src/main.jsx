import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page";
import ProviderPage from "./routes/provider-page";
import {
  getProviderAppointments,
  getProviderById,
  getProviderCategories,
  getProvidersByFilters,
} from "./actions/providerActions";
import HomePage from "./routes/home-page";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "providers/:providerId",
        element: <ProviderPage />,
        loader: async ({ params }) => {
          const provider = await getProviderById(params.providerId);
          const providerCategories = await getProviderCategories(
            params.providerId
          );
          const providerAppointments = await getProviderAppointments(
            params.providerId
          );
          return { provider, providerCategories, providerAppointments };
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
