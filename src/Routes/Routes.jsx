import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Register from "../pages/Register/Register";


export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children: [
        {
          path: "/",
          element: <Register></Register>,
        },
      ]
    },
  ]);