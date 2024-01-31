import { useEffect, useState } from 'react';
import useAxiosPublic from '../../../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";



const formatTime = (time) => {
  const date = new Date(time);

  // Specify the date format options for dd/mm/yy
  const options = { day: '2-digit', month: '2-digit', year: '2-digit' };

  // Format the date
  const formattedDate = date.toLocaleDateString('en-GB', options);
  const formattedTime = date.toLocaleTimeString();

  return { formattedDate, formattedTime };
};

const ManageVisitorByAdmin = () => {
  const axiosPublic = useAxiosPublic();
  const [visitors, setVisitors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchDate, setSearchDate] = useState(""); // State for single date search
  const [startDate, setStartDate] = useState(""); // State for date range search start date
  const [endDate, setEndDate] = useState(""); // State for date range search end date
  const [searchResult, setSearchResult] = useState([]); // State for search result
  const [isSearching, setIsSearching] = useState(false); // State to track if searching is active


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
const currentItems = isSearching ? searchResult.slice(indexOfFirstItem, indexOfLastItem) : visitors.slice(indexOfFirstItem, indexOfLastItem);

const pages = isSearching ? Math.ceil(searchResult.length / itemsPerPage) : Math.ceil(visitors.length / itemsPerPage);
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


const handleSearchByDate = () => {
    // Search logic by single date
    if (searchDate.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid date!',
      });
      return;
    }
  
    // Format searchDate to match formattedDate
    const searchYear = searchDate.substring(0, 4);
    const searchMonth = searchDate.substring(5, 7);
    const searchDay = searchDate.substring(8, 10);
    const formattedSearchDate = `${searchDay}/${searchMonth}/${searchYear.slice(-2)}`;
    console.log("Formatted Search Date:", formattedSearchDate);
  
    const searchResult = visitors.filter((visitor) => {
      const formattedDate = formatTime(visitor.entranceTime).formattedDate;
      console.log("Formatted Date:", formattedDate);
      console.log("Visitor:", visitor);
  
      return formattedDate === formattedSearchDate;
    });

    setSearchResult(searchResult);
    setIsSearching(true);
};


  

  
  

  const handleSearchByDateRange = () => {
    // Search logic by date range
    if (startDate.trim() === "" || endDate.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select start and end dates for the range!',
      });
      return;
    }

    const searchResult = visitors.filter((visitor) => {
      const visitorDate = new Date(visitor.entranceTime);
      const rangeStartDate = new Date(startDate);
rangeStartDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

const rangeEndDate = new Date(endDate);
rangeEndDate.setHours(23, 59, 59, 999); // Set to the end of the day

      return visitorDate >= rangeStartDate && visitorDate <= rangeEndDate;
    });

    setSearchResult(searchResult);
    setIsSearching(true);
  };

  const handleSavePDF = () => {
    // Generate PDF logic
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Section', 'Purpose', 'Entrance Date & Time', 'Exit Date & Time', 'Status']],
      body: searchResult.map(visitor => [
        visitor.name,
        visitor.section,
        visitor.purpose,
        `${formatTime(visitor.entranceTime).formattedDate} ${formatTime(visitor.entranceTime).formattedTime}`,
        visitor.exitTime ? `${formatTime(visitor.exitTime).formattedDate} ${formatTime(visitor.exitTime).formattedTime}` : 'Not Exit yet',
        visitor.status === "active" ? "Active" : "Inactive"
      ]),
    });
    doc.save("visitors.pdf");
  };

  return (
    <div>

   <div className='text-center bg-emerald-800 p-6 rounded-xl mb-6'>
        <h2 className='text-2xl text-slate-100 font-bold'>Total Visitors : <span className='bg-green-500 font-extrabold px-2 rounded-lg'>{visitors.length}</span></h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 mb-6">
  {/* Single Date Search */}
  <div className="flex flex-col lg:flex-row items-center">
    <input
      type="date"
      value={searchDate}
      onChange={(e) => setSearchDate(e.target.value)}
      className="border border-gray-300 p-2 rounded-md mb-2 lg:mb-0 lg:mr-2"
    />
    <button onClick={handleSearchByDate} className="bg-blue-500 text-white px-4 py-2 rounded-md">Search By Date</button>
  </div>
  {/* Date Range Search */}
  <div className="flex flex-col lg:flex-row items-center">
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="border border-gray-300 p-2 rounded-md mb-2 lg:mb-0 lg:mr-2"
    />
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="border border-gray-300 p-2 rounded-md mb-2 lg:mb-0 lg:mr-2"
    />
    <button onClick={handleSearchByDateRange} className="bg-blue-500 text-white px-4 py-2 rounded-md">Search By Date Range</button>
  </div>
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
            {(isSearching ? searchResult : currentItems).map((visitor, index) => (
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

            {/* Pagination */}
            <nav className="flex justify-center mt-10 mb-6">
        <select className="mr-6 border border-solid border-teal-400 rounded-lg" value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(e.target.value)}>
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        {/* Add more options as needed */}
      </select>
          <button
            className="btn btn-sm btn-info"
            onClick={handlePrevClick}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <ul className="flex list-none gap-10 mx-8 ">
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
            className="btn btn-sm btn-info"
            onClick={handleNextClick}
            disabled={currentPage === pages - 1}
          >
            Next
          </button>
        </nav>

         {/* Save PDF Button */}
      {isSearching && (
        <button onClick={handleSavePDF} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save as PDF</button>
      )}
      </div>
    </div>
  );
};

export default ManageVisitorByAdmin;