import { useEffect, useState } from 'react';
import useAxiosPublic from '../../../../hooks/useAxiosPublic';

const formatTime = (time) => {
  const date = new Date(time);

  // Specify the date format options for dd/mm/yy
  const options = { day: '2-digit', month: '2-digit', year: '2-digit' };

  // Format the date
  const formattedDate = date.toLocaleDateString('en-GB', options);
  const formattedTime = date.toLocaleTimeString();

  return { formattedDate, formattedTime };
};


const ActiveVisitor = () => {
  const axiosPublic = useAxiosPublic();
  const [visitors, setVisitors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axiosPublic.get('/visitors');
        // Filter only active visitors
        const activeVisitors = response.data.filter(visitor => visitor.status === "active");
        setVisitors(activeVisitors);
      } catch (error) {
        console.error('Error fetching visitors:', error.message);
      }
    };

    fetchVisitors();
  }, [axiosPublic]);


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


  return (
    <div>
      <div className='text-center bg-emerald-800 p-10 rounded-xl'>
        <h2 className='text-2xl text-slate-100 font-bold'>Active Visitors : <span className='bg-green-500 font-extrabold px-2 rounded-lg'>{visitors.length}</span></h2>
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
            </tr>
          </thead>
          <tbody>
            {currentItems.map((visitor, index) => (
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

export default ActiveVisitor;
