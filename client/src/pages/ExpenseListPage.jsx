import { useState, useEffect } from "react";
import API from "../api";
import { Search, Filter, Trash2 } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import toast from "react-hot-toast";
import "../styles/expenselist.css";
import "../styles/addexpense.css"; // Reusing badge styles

export default function ExpenseListPage() {
  const { expenses, fetchExpenses, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

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

  const categories = ["All", "Food", "Transport", "Entertainment", "Bills", "Health", "Education", "Other"];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const months = ["All", ...Array.from(new Set(expenses.map(exp => {
    return new Date(exp.date).toLocaleString("default", { month: "long", year: "numeric" });
  })))].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return new Date(b) - new Date(a); // Sort newest months first
  });

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory;

    const expenseMonth = new Date(expense.date).toLocaleString("default", { month: "long", year: "numeric" });
    const matchesMonth = selectedMonth === "All" || expenseMonth === selectedMonth;

    return matchesSearch && matchesCategory && matchesMonth;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const groupedExpenses = filteredExpenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(exp);
    return acc;
  }, {});

  // Helper reuse from RecentEntries (could be utility but inline for now)
  const getCategoryColor = (category) => {
    switch (category) {
      case "Food": return "badge-food";
      case "Transport": return "badge-transport";
      case "Entertainment": return "badge-entertainment";
      case "Bills": return "badge-bills";
      case "Health": return "badge-health";
      case "Education": return "badge-education";
      default: return "badge-other";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="expense-list-page">
      <div className="list-header">
        <div>
          <h1 className="page-title">Expense List</h1>
          <p className="expense-meta">
            {filteredExpenses.length} expenses • {formatCurrency(totalAmount)} total
          </p>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-wrapper">
          <Filter size={18} className="filter-icon" style={{ left: "1rem", zIndex: 1 }} />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="filter-select"
            style={{ paddingLeft: "2.5rem" }}
          >
            {months.map(month => (
              <option key={month} value={month}>{month === "All" ? "All Months" : month}</option>
            ))}
          </select>
        </div>

        <div className="filter-wrapper">
          <Filter size={18} className="filter-icon" style={{ left: "1rem", zIndex: 1 }} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
            style={{ paddingLeft: "2.5rem" }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="expense-list-card">
        {Object.keys(groupedExpenses).length > 0 ? (
          Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a)).map((month) => {
            const monthTotal = groupedExpenses[month].reduce((sum, exp) => sum + exp.amount, 0);
            return (
              <div key={month} className="month-group">
                <div className="month-group-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f9fafb',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <h2 className="month-title" style={{ padding: 0, border: 'none' }}>{month}</h2>
                  <span style={{ fontWeight: '600', color: '#4b5563' }}>
                    {formatCurrency(monthTotal)}
                  </span>
                </div>
                <div className="list-table-container">
                  <table className="expense-list-table">
                    <thead>
                      <tr>
                        <th className="col-title">TITLE</th>
                        <th>CATEGORY</th>
                        <th className="col-amount">AMOUNT</th>
                        <th className="col-date">DATE</th>
                        <th style={{ width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedExpenses[month].map((expense) => (
                        <tr key={expense._id || expense.id || Math.random()}>
                          <td className="col-title">{expense.title}</td>
                          <td>
                            <span className={`category-badge ${getCategoryColor(expense.category)}`}>
                              {expense.category || "Uncategorized"}
                            </span>
                          </td>
                          <td className="col-amount">{formatCurrency(expense.amount)}</td>
                          <td className="col-date">
                            {new Date(expense.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              onClick={() => handleDelete(expense._id || expense.id)}
                              style={{
                                color: "#ef4444",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                transition: "color 0.2s"
                              }}
                              title="Delete Expense"
                            >
                              <Trash2 size={16} />
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
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            No expenses found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
