import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Dashboard from "../layout/Dashboard";
import AllUsers from "../pages/Dashboard/Admin/AllUsers/AllUsers";
import AddVisitor from "../pages/Dashboard/Coordinator/AddVisitor/AddVisitor";
import ActiveVisitor from "../pages/Dashboard/Admin/ActiveVisitor/ActiveVisitor";
import ManageVisitor from "../pages/Dashboard/Coordinator/ManageVisitor/ManageVisitor";
import UpdateVisitor from "../pages/Dashboard/Coordinator/UpdateVisitor/UpdateVisitor";
import NoRoleWelcome from "../pages/Dashboard/NoRole/NoRoleWelcome/NoRoleWelcome";


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
      element: <Dashboard></Dashboard>,
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
          loader: ({params})=> fetch(`http://localhost:5000/visitors/update/${params.id}`)
  
        },
  
        
      ]
     
    }
  ]);