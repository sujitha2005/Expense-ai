import React from "react";

export default function CategoryBreakdown({ expenses = [] }) {
    // Aggregate expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
        const { category, amount } = expense;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});

    const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    // Convert to array and sort by amount (descending)
    const sortedCategories = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getProgressClass = (category) => {
        switch (category) {
            case "Food": return "progress-food";
            case "Transport": return "progress-transport";
            case "Entertainment": return "progress-entertainment";
            case "Bills": return "progress-bills";
            case "Health": return "progress-health";
            case "Education": return "progress-education";
            default: return "progress-other";
        }
    };

    return (
        <div className="breakdown-section">
            <h3 className="breakdown-title">Category Breakdown</h3>

            {sortedCategories.length > 0 ? (
                sortedCategories.map((item) => (
                    <div key={item.category} className="breakdown-item">
                        <span className="item-label">{item.category}</span>
                        <div className="progress-container">
                            <div
                                className={`progress-bar ${getProgressClass(item.category)}`}
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                        <div className="item-stats">
                            <span className="item-amount">{formatCurrency(item.amount)}</span>
                            <span className="item-percentage">{item.percentage.toFixed(1)}%</span>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-4">No expenses recorded yet.</p>
            )}
        </div>
    );
}
