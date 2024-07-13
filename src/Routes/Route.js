import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../Component/Layout/Layout";
import Home from "../View/Home/Home";

export default function Route() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/graphboard/:customerId", element: <Home /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
