import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}
