import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-title">ExpenseIQ</div>
      <div className="navbar-right">
        {user ? (
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={logout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
            <div className="profile-circle">{user.name.charAt(0).toUpperCase()}</div>
          </div>
        ) : (
          <Link to="/auth" className="auth-link">
            Login / Signup
          </Link>
        )}
      </div>
    </div>
  );
}
