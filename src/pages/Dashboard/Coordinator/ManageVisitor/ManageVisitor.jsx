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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = visitors.slice(indexOfFirstItem, indexOfLastItem);

  const pages = Math.ceil(visitors.length / itemsPerPage);
  const pageNumbers = [...Array(pages).keys()];



  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages - 1));
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    // You can perform additional logic when itemsPerPage changes, e.g., fetch data with the new itemsPerPage
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

      <div className='text-center bg-emerald-800 p-6 rounded-xl mb-6'>
        <h2 className='text-2xl text-slate-100 font-bold'>Total Visitorss : <span className='bg-green-500 font-extrabold px-2 rounded-lg'>{visitors.length}</span></h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 mb-6">

      </div>

      <div className="overflow-x-auto ">
        <table className="table table-xs">
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
            {(currentItems).map((visitor, index) => (
              <tr key={visitor._id}>
                <th>{index + indexOfFirstItem + 1}.</th>
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
      {/* Pagination */}
      <nav className="flex flex-col items-center md:flex-row justify-center mt-10 mb-6">
        <select className="mb-4 md:mb-0 mr-0 md:mr-6 border border-solid border-teal-400 rounded-lg" value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(e.target.value)}>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          {/* Add more options as needed */}
        </select>
        <div className="flex justify-center md:justify-start mb-4 md:mb-0">
          <button
            className="btn btn-sm btn-info mr-2"
            onClick={handlePrevClick}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <ul className="flex list-none gap-2 md:gap-10">
            {pageNumbers.map((pageNumber) => (
              <li
                key={pageNumber}
                className={`pagination-item ${currentPage === pageNumber ? 'btn btn-sm bg-teal-950 text-white' : ''}`}
              >
                <button
                  className="pagination-link"
                  onClick={() => handlePageClick(pageNumber)}
                >
                  {pageNumber + 1}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-sm btn-info ml-2"
            onClick={handleNextClick}
            disabled={currentPage === pages - 1}
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ManageVisitor;