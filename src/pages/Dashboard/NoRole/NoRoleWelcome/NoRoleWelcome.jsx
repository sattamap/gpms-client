import { useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";

const NoRoleWelcome = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8 md:p-16 shadow-xl rounded-xl">
      <div className="bg-blue-200 text-lg md:text-2xl lg:text-3xl font-bold text-center p-4 md:p-8 rounded-md mb-4">
        Welcome!{" "}
        <span className="text-green-500 uppercase">{user?.displayName}</span>{" "}
        to GPMS of Bangladesh Betar, Bandarban
      </div>
      <div className="bg-red-200 text-lg md:text-2xl lg:text-3xl font-bold text-center p-4 md:p-8 rounded-md">
        Your current status is &apos;none&apos;. Please wait for admin approval to gain access.
      </div>
    </div>
  );
};

export default NoRoleWelcome;
