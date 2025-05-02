// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ allowedRoles, children }) => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   // Check if user exists and has an allowed role
//   if (!user || (Array.isArray(allowedRoles)
//     ? !allowedRoles.includes(user.role)
//     : user.role !== allowedRoles)) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;
