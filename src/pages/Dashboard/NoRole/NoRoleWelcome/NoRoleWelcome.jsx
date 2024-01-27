import { useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";

const NoRoleWelcome = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-slate-200 p-8 md:p-16 shadow-xl rounded-xl">
      <p className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
        Welcome!{" "}
        <span className="text-green-500 uppercase">{user?.displayName}</span>{" "}
        to GPMS of Bangladesh Betar, Bandarban <br /> Your current status is{" "}
        &apos;none&apos;. Please wait for admin approval to gain access.
      </p>
    </div>
  );
};

export default NoRoleWelcome;
