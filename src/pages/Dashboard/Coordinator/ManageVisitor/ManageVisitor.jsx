import { useEffect, useState } from 'react';
import useAxiosPublic from '../../../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const formatTime = (time) => {
  const date = new Date(time);

  // Specify the date format options for dd/mm/yy
  const options = { day: '2-digit', month: '2-digit', year: '2-digit' };

  // Format the date
  const formattedDate = date.toLocaleDateString('en-GB', options);
  const formattedTime = date.toLocaleTimeString();

  return { formattedDate, formattedTime };
};

const ManageVisitor = () => {
  const axiosPublic = useAxiosPublic();
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axiosPublic.get('/visitors');
        setVisitors(response.data);
      } catch (error) {
        console.error('Error fetching visitors:', error.message);
      }
    };

    fetchVisitors();
  }, [axiosPublic]);

  const handleToggleStatus = async (visitor) => {
    const newStatus = visitor.status === "active" ? "inactive" : "active";

    Swal.fire({
      title: `Are you sure you want to ${newStatus === "active" ? "activate" : "inactive"} ${visitor.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${newStatus === "active" ? "activate" : "inactive"} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.patch(`/visitors/status/${visitor._id}`, { status: newStatus }).then((res) => {
          if (res.data.modifiedCount > 0) {
            window.location.reload();
            const statusMessage = newStatus === "active" ? "activated" : "inactive";
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${visitor.name}'s status has been ${statusMessage}`,
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  };


  const handleDelete = (visitor) => {
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


        axiosPublic.delete(`/visitors/${visitor._id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              window.location.reload();
              Swal.fire({
                title: "Deleted!",
                text: "Visitor has been deleted.",
                icon: "success"
              });
            }
          })
      }
    });
  }

  return (
    <div>
      <div className='bg-emerald-600 p-4'>
        <h2>Active Visitors</h2>
        <h2>{visitors.length}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Section</th>
              <th>Purpose</th>
              <th>Entrance Date & Time</th>
              <th>Exit Date & Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor, index) => (
              <tr key={visitor._id}>
                <th>{index + 1}</th>
                <td>{visitor.name}</td>
                <td>{visitor.section}</td>
                <td>{visitor.purpose}</td>
                <td>{formatTime(visitor.entranceTime).formattedDate} <br /> {formatTime(visitor.entranceTime).formattedTime}</td>
                <td>
                  {visitor.exitTime ? (
                    <>
                      {formatTime(visitor.exitTime).formattedDate} <br /> {formatTime(visitor.exitTime).formattedTime}
                    </>
                  ) : (
                    <span className='text-green-700'>Not Exit yet</span>
                  )}
                </td>


                <td>
                  <button
                    onClick={() => handleToggleStatus(visitor)}
                    className={`btn btn-ghost btn-xs ${visitor.status === "active" ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {visitor.status === "active" ? "Active" : "Inactive"}
                  </button>
                </td>
                <th>
                  <button
                    onClick={() => handleDelete(visitor)}
                    className="btn btn-ghost btn-xs"
                  >
                    Del
                  </button>
                  <Link to={`/dashboard/updateVisitor/${visitor._id}`}>
                    <button

                      className="btn btn-ghost btn-xs"
                    >
                      Edit
                    </button>
                  </Link>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageVisitor;
