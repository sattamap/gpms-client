import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import bb from '../../assets/bb.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const { signIn, sendPassResetEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard/';

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    let errorMessage = 'An error occurred during login. Please try again.'; // Define errorMessage here
  
    signIn(data.email, data.password)
      .then((result) => {
        const user = result.user;
        const displayName = user.displayName || ''; // Get the user's display name (if available)
        const welcomeMessage = `Welcome back to the GPMS, ${displayName}!`; // Construct the welcome message
        Swal.fire({
          title: 'Login Successful',
          text: welcomeMessage,
          icon: 'success',
        });
  
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log("error object:", error);
        
        // Check for specific error code 'auth/invalid-credential'
        if (error.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        }
  
        Swal.fire({
          title: 'Login Failed',
          text: errorMessage,
          icon: 'error',
        });
      });
  };
  
  
  
  
  

  const handleOpenResetModal = () => {
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
  };

  const handleResetPassword = async () => {
    try {
      await sendPassResetEmail(resetEmail);
      console.log('Password reset email sent successfully.');
      Swal.fire({
        title: 'Password Reset Email Sent',
        text: 'Check your inbox for instructions to reset your password.',
        icon: 'success',
      });
      handleCloseResetModal();
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-400">
      <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
        <div className=' flex items-center justify-center text-xl font-bold bg-purple-300 rounded-xl mb-5'>
          <div>
            <img className='w-20' src={bb} alt="" />
          </div>
          <h2>GPMS of Bangladesh Betar, Bandarban</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left mb-8">
            <h4 className="text-4xl font-bold mb-4 text-emerald-800">Welcome Back!</h4>
            <p className="text-base">
              Log in to manage gate pass requests and streamline your gate access operations.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    {...register('email', { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Enter email"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    {...register('password', { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Enter password"
                  />
                  <div className="absolute top-1/2 right-0 pr-3 flex items-center">
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 cursor-pointer" onClick={togglePasswordVisibility} />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={togglePasswordVisibility} />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
            <p className="text-center mt-3 text-sm">
              New here? <Link to='/register' className="text-blue-500">Create an account</Link>
            </p>
            <p className="text-center mt-3 text-sm">
              Forgot your password?{' '}
              <button
                className="text-blue-500"
                onClick={handleOpenResetModal}
              >
                Reset it here
              </button>
            </p>
          </div>
        </div>
       <div className='space-y-4'>
       <div className="flex justify-center gap-4 mt-8">
  <Link to="/contact" className="text-sm font-medium text-indigo-900 hover:underline border-r-2 border-black pr-4">Contact</Link>
  <Link to="/about" className="text-sm font-medium text-indigo-900 hover:underline">About GPMS</Link>
</div>
            <p className="text-center mt-8 text-sm text-gray-500">&copy; 2024 Gate Pass Management System | Developed by Sattam</p>
        
       </div>
      </div>

      {/* Reset password modal */}
      {showResetModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md mb-4"
              placeholder="Enter your email"
            />
            <div className="flex justify-end">
              <button onClick={handleCloseResetModal} className="mr-2 text-gray-500 hover:text-gray-700">
                Cancel
              </button>
              <button onClick={handleResetPassword} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
