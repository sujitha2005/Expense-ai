import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  BarChart3,
  Download,
  IndianRupee,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";

const sidebarStyles = `
/* ===== MOBILE TOGGLE ===== */
.mobile-toggle {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 100;
  padding: 8px;
  border-radius: 8px;
  background: white;
  border: 1px solid #ddd;
  display: none;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 30;
  display: none;
}

.sidebar-overlay.active {
  display: block;
}

/* ===== SIDEBAR ===== */
.sidebar-container {
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  background: linear-gradient(180deg, #065f46, #047857);
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 20;
  transition: transform 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-box {
  width: 40px;
  height: 40px;
  background: #10b981;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.logo-subtitle {
  font-size: 12px;
  color: #a7f3d0;
}

.sidebar-nav {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #d1fae5;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(16, 185, 129, 0.2);
  color: white;
}

.active-nav {
  background: #10b981;
  color: white;
  font-weight: 600;
}

/* ===== FOOTER ===== */
.sidebar-footer {
  margin: 15px;
  padding: 15px;
  background: rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.footer-label {
  font-size: 12px;
  color: #d1fae5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-amount {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
  color: #a7f3d0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .mobile-toggle {
    display: block;
  }

  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    z-index: 40;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay.active {
    display: block;
  }
}
`;

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add", label: "Add Expense", icon: PlusCircle },
  { to: "/expenses", label: "Expense List", icon: List },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/import-export", label: "Import / Export", icon: Download }
];


const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { expenses } = useExpenses();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTotal = expenses
    .filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <style>{sidebarStyles}</style>
      {/* Mobile Toggle Button */}
      <button
        className="mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-container ${mobileOpen ? "sidebar-open" : ""
          }`}
      >
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-box">
            <IndianRupee size={20} />
          </div>
          <div>
            <h1 className="logo-title">ExpenseIQ</h1>
            <p className="logo-subtitle">Smart Tracker</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "nav-item active-nav"
                  : "nav-item"
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Card */}
        <div className="sidebar-footer">
          <p className="footer-label">Total This Month</p>
          <p className="footer-amount">{formatCurrency(thisMonthTotal)}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
