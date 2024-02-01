import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Dashboard from "../layout/Dashboard";
import AllUsers from "../pages/Dashboard/Admin/AllUsers/AllUsers";
import AddVisitor from "../pages/Dashboard/Coordinator/AddVisitor/AddVisitor";
import ActiveVisitor from "../pages/Dashboard/Admin/ActiveVisitor/ActiveVisitor";
import UpdateVisitor from "../pages/Dashboard/Coordinator/UpdateVisitor/UpdateVisitor";
import NoRoleWelcome from "../pages/Dashboard/NoRole/NoRoleWelcome/NoRoleWelcome";
import PrivateRoutes from "./PrivateRoutes";
import ManageVisitorByAdmin from "../pages/Dashboard/Admin/ManageVisitorByAdmin/ManageVisitorByAdmin";
import ManageVisitor from "../pages/Dashboard/Coordinator/ManageVisitor/ManageVisitor";


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
    {
      path: "dashboard",
      element: <PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>,
      children: [
        // user (no role) routes
        {
          path: "none",
          element: <NoRoleWelcome></NoRoleWelcome>,
        },
  
        // admin routes
     
        {
          path: "allUsers",
          element: <AllUsers></AllUsers>,
        },
        {
          path: "activeVisitor",
          element: <ActiveVisitor></ActiveVisitor>,
        },
        {
          path: "manageVisitor",
          element: <ManageVisitorByAdmin></ManageVisitorByAdmin>,
        },
        
  
        // coordinator routes
     
        {
          path: "addVisitor",
          element:<AddVisitor></AddVisitor>,
        },
     
        {
          path: "manage",
          element:<ManageVisitor></ManageVisitor>,
        },
        {
          path: 'updateVisitor/:id',
          element:<UpdateVisitor></UpdateVisitor>,
          loader: ({params})=> fetch(`https://gpms-server.vercel.app/visitors/update/${params.id}`)
  
        },
  
        
      ]
     
    }
  ]);