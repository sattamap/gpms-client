import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";



const useAdmin = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const { data: isAdmin, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !loading,
        queryFn: async () => {
            console.log('checking admin', user)
            const res = await axiosPublic.get(`/users/admin/${user.email}`);
            console.log(res.data);
            return res.data?.admin;
            
        }
       
    })

    
    return [isAdmin, isAdminLoading]
};

export default useAdmin;