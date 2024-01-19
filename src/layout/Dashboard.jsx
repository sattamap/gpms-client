import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaUsers } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Dashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const axiosPublic = useAxiosPublic();
 
  useEffect(() => {
    // Fetch user data from MongoDB using Axios
    const fetchUserData = async () => {
      try {
        const response = await axiosPublic.get(`/users/${user.email}`);
        const data = response.data;
  
        console.log('Received User Data:', data); // Log the data to the console
  
        // If the data is an array, take the first element (assuming the array contains a single user)
        const userObject = Array.isArray(data) ? data[0] : data;
        setUserData(userObject);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [user, axiosPublic]);

  const handleLogOut = () => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex">
      <div className="w-64 min-h-screen bg-[#4dd0e1]">
        <div className="flex flex-col items-center justify-center p-4">
          <img
            src={user?.photoURL}
            alt="Profile"
            className="w-20 h-20 rounded-full mr-2"
          />
          <span className="text-white">{user?.name}</span>
        </div>
        <ul className="menu p-4">
          {userData?.status === "admin" && (
            <>
              <li>
                <NavLink to="/dashboard/welcome">
                  <FaHome /> Admin Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/allUsers">
                  <FaUsers /> All Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/activeVisitor">
                  <FaUsers /> Active Visitor
                </NavLink>
              </li>
            </>
          )}

          {userData?.status === "monitor" && (
          
               <li>
               <NavLink to="/dashboard/activeVisitor">
                 <FaUsers /> Active Visitor
               </NavLink>
             </li>
          )}

          {userData?.status === "coordinator" && (
            // Add links specific to the coordinator
            <li>
            <NavLink to="/dashboard/addVisitor">
              <FaUser /> Add Visitor
            </NavLink>
            <NavLink to="/dashboard/manage">
              <FaUser /> Manage Visitor
            </NavLink>
          </li>
          )}
          {userData?.status === "none" && (
            // Add links specific to the coordinator
            <li>
            <NavLink to="/dashboard/addVisitor">
              <FaUser /> Add Visitor
            </NavLink>
          </li>
          )}

          <div className="divider"></div>

          <li>
            <NavLink onClick={handleLogOut}>
              <FaHome /> Logout
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
