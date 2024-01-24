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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveVisitor;
