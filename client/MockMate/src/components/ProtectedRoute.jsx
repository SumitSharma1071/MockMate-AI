import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {

  const location = useLocation();

  if (user === null) {
    return <Navigate to="/register" state={{from : location}} replace/>;
  }
  return children;
};

export default ProtectedRoute;