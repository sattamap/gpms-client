import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";


const UpdateVisitor = () => {
    const { name, section, purpose, _id} = useLoaderData();
    console.log(name,section,purpose);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();


      const onSubmit = async (data) => {
   
    
        
          const updatedInfo = {
    
            name: data.name,
            section: data.section,
            purpose: data.purpose,
           
            
          }
          // 
          const updateResult = await axiosPublic.patch(`/visitors/update/${_id}`, updatedInfo);
          if(updateResult.data.modifiedCount > 0){
            // show success popup
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.name} is updated to the menu.`,
                showConfirmButton: false,
                timer: 1500
              });
              navigate('/dashboard/manage');
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
                defaultValue={name}
                {...register('name')}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">This field is required</p>}
            </div>

         

        
            <div className="mb-4">
              <label  className="block text-sm font-medium text-gray-600">
                Section
              </label>
              <select
                defaultValue={section}
                {...register('section')}
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
                defaultValue={purpose}
                {...register('purpose')}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.purpose && <p className="text-red-500 text-xs mt-1">This field is required</p>}
            </div>




            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4">
             Update Visitor
            </button>
          </form>

      

         
        </div>
      </div>
    </div>
    );
};

export default UpdateVisitor;