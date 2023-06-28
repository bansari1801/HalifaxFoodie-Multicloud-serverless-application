import { Navigate } from "react-router-dom";
const Logout = () => {
  localStorage.removeItem("email")
  localStorage.removeItem("userType")

  return <Navigate to="/" />;
}

export default Logout