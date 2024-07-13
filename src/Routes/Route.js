import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../Component/Layout/Layout";
import Home from "../View/Home/Home";
import GraphBoard from "../View/GraphBoard/GraphBoard";

export default function Route() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/graphboard/:customerId", element: <GraphBoard/> },

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
