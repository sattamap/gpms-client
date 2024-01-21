import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../../../hooks/useAxiosPublic';





const AddVisitor = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();



  const onSubmit = async (data) => {
    try {
      const entranceTime = new Date(); // Get the current date and time
  
      const visitorInfo = {
        name: data.name,
        section: data.section,
        purpose: data.purpose,
        entranceTime: entranceTime.toISOString(), // Store the entrance time as a string
        status: 'active',
      };
  
      const mongoDbResponse = await axiosPublic.post('/visitors', visitorInfo);
  
      if (!mongoDbResponse.data || !mongoDbResponse.data.insertedId) {
        throw new Error('Failed to create user in MongoDB');
      }
  
      reset();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Visitor added successfully',
        showConfirmButton: false,
        timer: 1500,
      });
  
      navigate('/dashboard/addVisitor');
    } catch (error) {
      console.error(error.message);
      if (error.response) {
        // Log detailed error response from ImgBB
        console.error('Error Response from ImgBB:', error.response.data);
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create user. Please try again.',
      });
    }
  };
  

  return (
    <div className="container mx-auto mt-8">
      <div className="">
      
        <div className="bg-white p-8 rounded-md shadow-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">This field is required</p>}
            </div>

         

        
            <div className="mb-4">
              <label  className="block text-sm font-medium text-gray-600">
                Section
              </label>
              <select
                {...register('section', { required: true })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              >
                <option value="default" disabled>Select Section</option>
                <option value="Program">Program</option>
                <option value="Engineering">Engineering</option>
                <option value="News">News</option>
              </select>
              {errors.section && <p className="text-red-500 text-xs mt-1">This field is required</p>}
            </div>
            <div className="mb-4">
              <label  className="block text-sm font-medium text-gray-600">
                Purpose
              </label>
              <input
                type="text"
                {...register('purpose', { required: true })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.purpose && <p className="text-red-500 text-xs mt-1">This field is required</p>}
            </div>




            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4">
             Add Visitor
            </button>
          </form>

      

         
        </div>
      </div>
    </div>
  );
};

export default AddVisitor;
