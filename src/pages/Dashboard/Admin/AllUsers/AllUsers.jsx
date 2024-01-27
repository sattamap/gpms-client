import { useQuery } from "@tanstack/react-query";
import { FaTimes, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Modal from 'react-modal';
import { useState } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";


Modal.setAppElement('#root');

const AllUsers = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [selectedStatus, setSelectedStatus] = useState("admin");

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users");
      return res.data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleToggleRole = (user) => {
    Swal.fire({
      title: `Select the new role for ${user.name}:`,
      input: 'select',
      inputOptions: {
        admin: 'Admin',
        monitor: 'Monitor',
        coordinator: 'Coordinator',
        none: 'No Role', // Add 'none' option for "No Role"
      },
      inputPlaceholder: 'Select a role',
      showCancelButton: true,
      confirmButtonText: 'Change',
    }).then((result) => {
      if (result.isConfirmed) {
        const newRole = result.value === 'none' ? 'none' : result.value;
        axiosPublic.patch(`/users/status/${user._id}`, { status: newRole }).then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            const roleMessage =
              newRole === "admin" ? "Admin" : newRole === "monitor" ? "Monitor" : newRole === "coordinator" ? "Coordinator" : "No Role";
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${user.name}'s role has been changed to ${roleMessage}`,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    });
  };
  

  const handleDelete = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/users/${user._id}`).then(res => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        });
      }
    });
  };

  const handleSeeInfo = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-evenly bg-emerald-900 p-10">
        <h2 className="text-2xl text-slate-100 font-extrabold">All Users</h2>
        <h2 className="text-2xl text-slate-100 font-extrabold">Total users: {users.length}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-xs table-zebra mt-10">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>User Info</th>
              <th>Action</th>
              {/* <th>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border p-1 rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="monitor">Monitor</option>
                  <option value="coordinator">Coordinator</option>
                </select>
              </th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
  <button
    onClick={() => handleToggleRole(user)}
    className={`btn btn-ghost btn-xs ${
      user.status === "admin"
        ? "text-blue-500"
        : user.status === "monitor"
        ? "text-yellow-500"
        : user.status === "coordinator"
        ? "text-red-500"
        : "text-gray-500" // Use gray color for "No Role"
    }`}
  >
    {user.status === "admin"
      ? "Admin"
      : user.status === "monitor"
      ? "Monitor"
      : user.status === "coordinator"
      ? "Coordinator"
      : "No Role"}
  </button>
</td>

  
                <td>
                  <button
                    onClick={() => handleSeeInfo(user)}
                    className="btn btn-ghost btn-xs"
                  >
                    See Info
                  </button>
                </td>
                <th>
                  <button
                    onClick={() => handleDelete(user)}
                    className="btn btn-ghost btn-xs"
                  >
                    <FaTrash></FaTrash>
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="User Information"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            width: '30%',
            height: '30%',
            margin: 'auto',
            borderRadius: '8px',
            padding: '20px',
          },
        }}
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-0 right-0 p-2 cursor-pointer"
        >
          <FaTimes />
        </button>
        {selectedUser && (
        <div className="flex items-center justify-center gap-4">
        <div>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Section:</strong> {selectedUser.section}</p>
          <p><strong>Designation:</strong> {selectedUser.designation}</p>
        </div>
        <div className="w-32 h-32">
  <img
    src={selectedUser.photoURL}
    alt={selectedUser.name}
    className="w-full h-full object-cover"
  />
</div>
      </div>
      
        )}
      </Modal>
    </div>
  );
};

export default AllUsers;
