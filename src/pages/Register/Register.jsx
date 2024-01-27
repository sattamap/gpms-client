import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
  const axiosPublic = useAxiosPublic();
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const validatePasswordMatch = (value) => {
    const password = watch('password');
    return password === value || 'Passwords do not match';
  };

  const onSubmit = async (data) => {
    try {
      const imageFile = { image: data.image[0] };
      const imgbbResponse = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      if (!imgbbResponse.data || imgbbResponse.data.status !== 200) {
        throw new Error('Failed to upload image to imgbb');
      }

      const imgbbImageLink = imgbbResponse.data.data.url;

      const authResult = await createUser(data.email, data.password);
      const loggedUser = authResult.user;
      console.log(loggedUser);
      await updateUserProfile(data.name, imgbbImageLink);

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const userInfo = {
        name: data.name,
        email: data.email,
        section: data.section,
        designation: data.designation,
        photoURL: imgbbImageLink,
        status: 'none',
      };

      const mongoDbResponse = await axiosPublic.post('/users', userInfo);

      if (!mongoDbResponse.data || !mongoDbResponse.data.insertedId) {
        console.error('Failed to upload image to imgbb. Response:', imgbbResponse);
        throw new Error('Failed to create user in MongoDB');
      }

      reset();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'User created successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
    } catch (error) {
      console.error(error.message);
      if (error.response) {
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
    <div className="w-3/4  mx-auto mt-8">
      <div className=" items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
          <p className="text-base text-gray-700">
            Join the Gate Pass Management System and streamline your gate access operations. Sign up today to unlock personalized gate pass services and enjoy a seamless experience tailored just for you.
          </p>
        </div>
        <div className="w-3/4 mx-auto bg-white p-4 my-10 rounded-md shadow-xl md:w-4/5 lg:w-full xl:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
    <div className='flex flex-col lg:flex-row gap-6 mb-6'>
    <div className="form-control w-full">
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

            <div className="form-control w-full ">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">This field is required</p>}
            </div>
    </div>

       <div className='flex flex-col lg:flex-row gap-6 mb-6'>
       <div className="form-control w-full ">
              <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                Photo
              </label>
              <input
                type="file"
                id="image"
                {...register('image')}
                className="border rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="form-control w-full ">
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-600">
                Mobile Number
              </label>
              <input
                type="tel"
                {...register('mobile', { required: true })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">This field is required</p>}
            </div>
       </div>

           <div className='flex flex-col lg:flex-row gap-6 mb-6'>

           <div className="form-control w-full">
              <label htmlFor="section" className="block text-sm font-medium text-gray-600">
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

            <div className="form-control w-full">
              <label htmlFor="designation" className="block text-sm font-medium text-gray-600">
                Designation
              </label>
              <input
                type="text"
                {...register('designation', { required: true })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.designation && <p className="text-red-500 text-xs mt-1">This field is required</p>}
            </div>
           </div>

           <div className='flex flex-col lg:flex-row gap-6 mb-6'>
           <div className="form-control w-full">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                {...register('password', {
                  required: true,
                  minLength: 6,
                  maxLength: 20,
                  pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]/,
                })}
                className={`mt-1 p-2 w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password?.type === 'required' && 'Password is required'}
                  {errors.password?.type === 'minLength' && 'Password must be 6 characters'}
                  {errors.password?.type === 'maxLength' && 'Password must be less than 20 characters'}
                  {errors.password?.type === 'pattern' && 'Password must have an uppercase, a lowercase, and a special character'}
                </p>
              )}
            </div>

            <div className="form-control w-full">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: true,
                  validate: validatePasswordMatch,
                })}
                className={`mt-1 p-2 w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
              )}
            </div>
           </div>

           <div className='flex justify-center'>
           <button type="submit" className="w-1/6 bg-blue-500 text-white px-4 py-2 rounded-full mt-4">
              Sign Up
            </button>
           </div>
          </form>

          <p className="text-center mt-3">
            Already have an account? <Link to="/" className="text-blue-500">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
