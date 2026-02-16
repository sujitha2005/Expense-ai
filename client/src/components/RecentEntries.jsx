import React from "react";
import { Trash2 } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";

export default function RecentEntries({
    expenses = [],
    title = "Recent Entries",
    limit = 5,
    showGrouping = true,
    showDelete = true
}) {
    const { deleteExpense } = useExpenses();

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

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
                // toast is handled by context
            }
        }
    };

    // Get entries based on limit
    const recentExpenses = limit ? expenses.slice(0, limit) : expenses;

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

    const groupedExpenses = recentExpenses.reduce((acc, exp) => {
        const month = new Date(exp.date).toLocaleString("default", { month: "long", year: "numeric" });
        if (!acc[month]) acc[month] = [];
        acc[month].push(exp);
        return acc;
    }, {});

    const renderTable = (entries) => (
        <div className="table-container">
            <table className="entries-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th className="amount-cell">Amount</th>
                        <th className="date-cell">Date</th>
                        {showDelete && <th style={{ width: '50px' }}></th>}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((expense) => (
                        <tr key={expense._id || expense.id || Math.random()}>
                            <td>{expense.title}</td>
                            <td>
                                <span className={`category-badge ${getCategoryColor(expense.category)}`}>
                                    {expense.category || "Uncategorized"}
                                </span>
                            </td>
                            <td className="amount-cell">
                                <span className="amount-text">{formatCurrency(expense.amount)}</span>
                            </td>
                            <td className="date-cell">
                                <span className="date-text">{formatDate(expense.date)}</span>
                            </td>
                            {showDelete && (
                                <td style={{ textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleDelete(expense._id || expense.id)}
                                        className="delete-btn"
                                        style={{
                                            color: '#ef4444',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'color 0.2s'
                                        }}
                                        title="Delete Expense"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="recent-entries-card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="card-title">{title}</h2>
                <div style={{ fontWeight: '600', color: '#16a34a' }}>
                    Total: {formatCurrency(recentExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </div>
            </div>
            {recentExpenses.length > 0 ? (
                showGrouping ? (
                    Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a)).map(month => {
                        const monthTotal = groupedExpenses[month].reduce((sum, exp) => sum + exp.amount, 0);
                        return (
                            <div key={month} className="month-group-container" style={{ marginBottom: '2rem' }}>
                                <div className="month-group-header" style={{
                                    padding: '0.75rem 1rem',
                                    background: '#f8fafc',
                                    borderBottom: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <h3 className="month-group-title" style={{
                                        fontSize: '1rem',
                                        color: '#475569',
                                        fontWeight: '600',
                                        margin: 0
                                    }}>{month}</h3>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                                        {formatCurrency(monthTotal)}
                                    </span>
                                </div>
                                {renderTable(groupedExpenses[month])}
                            </div>
                        );
                    })
                ) : renderTable(recentExpenses)
            ) : (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No recent expenses found.
                </div>
            )}
        </div>
    );
}
