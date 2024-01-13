import { NavLink, Outlet } from "react-router-dom";
import { FaHome,  FaUser, FaUsers, } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";




const Dashboard = () => {
    const { user } = useContext(AuthContext)
  

    return (
        <div className="flex">
            <div className="w-64 min-h-screen bg-[#4dd0e1]">
            <div className="flex flex-col items-center justify-center p-4">
          <img
            src={user.photoURL} // Replace with the actual URL of the user's profile picture
            alt="Profile"
            className="w-20 h-20 rounded-full mr-2"
          />
          <span className="text-white">{user.displayName}</span>
        </div>
                <ul className="menu p-4">
                    {
                        isAdmin ?
                            <>
                                <li><NavLink to="/dashboard/welcome">
                                    <FaHome></FaHome>  Admin Home
                                </NavLink>
                                </li>
                                <li><NavLink to="/dashboard/allUsers">
                                    <FaUsers></FaUsers>  All Users
                                </NavLink>
                                </li>
                               
                            </> :

                            <>

                                <li><NavLink to="/dashboard/profile">
                                    <FaUser></FaUser> User Profile
                                </NavLink>
                                </li>
                              
                            </>
                    }


                    <div className="divider"></div>


                    {/* shared Navlinks */}
                    <li><NavLink to="/">
                        <FaHome></FaHome> Login
                    </NavLink>
                    </li>
                   
                </ul>
            </div>
            <div className="flex-1 p-10">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;