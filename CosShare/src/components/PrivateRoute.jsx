import { Navigate } from "react-router-dom";

// Empêche l'insertion de données et la navigation via l'url
const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Décoder le token pour lire le rôle
  const payload = JSON.parse(atob(token.split(".")[1]));

  if (adminOnly && payload.type_de_compte !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PrivateRoute;
