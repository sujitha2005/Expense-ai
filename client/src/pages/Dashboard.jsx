import { useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyChart from "../components/MonthlyChart";
import { TrendingUp, Calendar, DollarSign, ListTodo, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import "../styles/dashboard.css";

const CATEGORY_COLORS = {
  Food: "#16a34a",
  Transport: "#06b6d4",
  Shopping: "#ec4899",
  Bills: "#eab308",
  Entertainment: "#a855f7",
  Health: "#10b981",
  Education: "#f97316",
  Other: "#6b7280"
};

export default function Dashboard() {
  const { expenses, fetchExpenses, deleteExpense } = useExpenses();

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("No ID found for this entry");
      return;
    }
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const avgExpense = expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : 0;
  const totalEntries = expenses.length;

  // Get recent expenses (last 12)
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12);

  const recentGrouped = recentExpenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(exp);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Your expense overview at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Expenses</h3>
            <DollarSign className="stat-icon" size={24} />
          </div>
          <p className="stat-value">₹{totalExpenses.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>This Month</h3>
            <Calendar className="stat-icon" size={24} />
          </div>
          <p className="stat-value">₹{thisMonthExpenses.toLocaleString()}</p>
          <span className="stat-label">Current month</span>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Avg. Expense</h3>
            <TrendingUp className="stat-icon" size={24} />
          </div>
          <p className="stat-value">₹{avgExpense}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Entries</h3>
            <ListTodo className="stat-icon" size={24} />
          </div>
          <p className="stat-value">{totalEntries}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <ExpenseChart expenses={expenses} />
        </div>
        <div className="chart-container">
          <MonthlyChart expenses={expenses} />
        </div>
      </div>

      {/* Recent Expenses by Month */}
      <div className="recent-expenses-section">
        <h2 className="section-title">Recent Expenses (Month-wise)</h2>
        {Object.keys(recentGrouped).length > 0 ? (
          Object.keys(recentGrouped).map((month) => {
            const monthTotal = recentGrouped[month].reduce((sum, exp) => sum + exp.amount, 0);
            return (
              <div key={month} className="dashboard-month-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 className="month-group-title" style={{ margin: 0 }}>{month}</h3>
                  <span style={{ fontWeight: '600', color: '#10b981', fontSize: '1rem' }}>
                    ₹ {monthTotal.toLocaleString()}
                  </span>
                </div>
                <div className="table-container">
                  <table className="expenses-table">
                    <thead>
                      <tr>
                        <th>TITLE</th>
                        <th>CATEGORY</th>
                        <th>AMOUNT</th>
                        <th>DATE</th>
                        <th style={{ width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentGrouped[month].map((exp) => (
                        <tr key={exp._id || exp.id || Math.random()}>
                          <td className="title-cell">{exp.title}</td>
                          <td>
                            <span
                              className="category-badge"
                              style={{ backgroundColor: CATEGORY_COLORS[exp.category] || "#6b7280" }}
                            >
                              {exp.category}
                            </span>
                          </td>
                          <td className="amount-cell">₹ {exp.amount.toLocaleString()}</td>
                          <td className="date-cell">
                            {new Date(exp.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => handleDelete(exp._id || exp.id)}
                              style={{
                                color: '#ef4444',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'opacity 0.2s',
                              }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-data-text">No expenses found.</p>
        )}
      </div>
    </div>
  );
}
