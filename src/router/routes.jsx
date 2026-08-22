import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import HomeView from "../pages/public/public_Home/HomeView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children:[
      {
        index: true,
        element: <HomeView />,
      }
    ]
  },
]);