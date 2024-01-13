import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";


export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children: [
        {
          path: "register",
          element: <Register></Register>,
        },
        {
          path: "/",
          element: <Login></Login>,
        },
      ]
    },
  ]);