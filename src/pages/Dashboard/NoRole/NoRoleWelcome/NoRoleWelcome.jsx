import { useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";


const NoRoleWelcome = () => {
  const { user} = useContext(AuthContext);
  return (
    <div className="bg-slate-200 p-16 shadow-xl rounded-xl">
      <p className="text-2xl font-bold text-center">
        Welcome! <span className="text-green-500 uppercase">{user?.displayName}</span> to GPMS of Banladesh Betar, Bandarban  <br /> Your current status is &apos;none&apos;. Please wait for admin approval to gain access.
      </p>
    </div>
  );
};

export default NoRoleWelcome;
