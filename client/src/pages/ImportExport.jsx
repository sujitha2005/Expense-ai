import React, { useState, useEffect } from "react";
import API from "../api";
import CSVImport from "../components/CSVImport";
import ExportButtons from "../components/ExportButtons";
import CategoryChart from "../components/CategoryChart";
import CategoryBreakdown from "../components/CategoryBreakdown";
import RecentEntries from "../components/RecentEntries";
import { useExpenses } from "../context/ExpenseContext";
import "../styles/importexport.css";

export default function ImportExport() {
  const [expenses, setExpenses] = useState([]);
  const [isImportView, setIsImportView] = useState(false);
  const [fileName, setFileName] = useState("");
  const { fetchExpenses: refreshGlobal } = useExpenses();

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
      setIsImportView(false);
      setFileName("");
      refreshGlobal(); // Sync global dashboard/sidebar
    } catch (error) {
      console.error("Error fetching expenses for export:", error);
    }
  };

  const handleImportSuccess = (importedData, file) => {
    setExpenses(importedData);
    setIsImportView(true);
    setFileName(file);
    refreshGlobal(); // Sync global dashboard/sidebar
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleClearImport = () => {
    fetchExpenses();
  };

  const groupedExpenses = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(exp);
    return acc;
  }, {});

  return (
    <div className="import-export-page">
      <div className="page-header">
        <h1 className="page-title">Import & Export</h1>
        <p className="page-subtitle">Manage your expense data</p>
      </div>

      <div className="function-card">
        <h2 className="card-title">
          Import CSV
        </h2>
        <p className="card-description">
          Upload a CSV file with columns: <span className="code-snippet">title, amount, date, category</span>
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <CSVImport refreshExpenses={handleImportSuccess} />
          {fileName && (
            <div className="file-info-badge">
              <span className="file-name">{fileName}</span>
              <button className="remove-file-btn" onClick={handleClearImport}>×</button>
            </div>
          )}
        </div>
      </div>

      <div className="function-card">
        <h2 className="card-title">
          Export Data
        </h2>
        <p className="card-description">
          Download your expenses as CSV or PDF
        </p>
        <ExportButtons expenses={expenses} />
      </div>

      {expenses.length > 0 && (
        <div style={{ marginTop: "3rem", borderTop: "1px solid #e5e7eb", paddingTop: "2rem" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "1.5rem" }}>
            <h2 className="card-title" style={{ margin: 0 }}>
              {isImportView ? "Imported Data Overview" : "Expense Overview"}
            </h2>
            {isImportView && (
              <button
                onClick={fetchExpenses}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Show All Expenses
              </button>
            )}
          </div>

          <div className="reports-grid">
            <CategoryChart expenses={expenses} />
            <CategoryBreakdown expenses={expenses} />
          </div>

          <div className="expense-list-section" style={{ marginTop: "3rem" }}>
            <RecentEntries
              expenses={expenses}
              title={isImportView ? "Imported Expenses by Month" : "All Expenses by Month"}
              limit={null}
              showGrouping={true}
              showDelete={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers (reused from ExpenseListPage)
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
