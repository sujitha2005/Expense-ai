import React from "react";

export default function MonthlyBreakdown({ expenses = [] }) {
    // Aggregate expenses by month
    const monthlyTotals = expenses.reduce((acc, exp) => {
        const month = new Date(exp.date).toLocaleString("default", {
            month: "long",
            year: "numeric"
        });
        if (!acc[month]) {
            acc[month] = { total: 0, count: 0 };
        }
        acc[month].total += exp.amount;
        acc[month].count += 1;
        return acc;
    }, {});

    // Convert to array and sort by date (newest first)
    const sortedMonths = Object.entries(monthlyTotals)
        .map(([month, data]) => ({
            month,
            total: data.total,
            count: data.count,
            date: new Date(month)
        }))
        .sort((a, b) => b.date - a.date);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="breakdown-section">
            <h3 className="breakdown-title">Monthly Summary</h3>

            {sortedMonths.length > 0 ? (
                <div className="monthly-list">
                    {sortedMonths.map((item) => (
                        <div key={item.month} className="breakdown-item" style={{ padding: '12px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <div>
                                    <span className="item-label" style={{ display: 'block', fontSize: '1rem', fontWeight: '600' }}>
                                        {item.month}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                        {item.count} expenses
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="item-amount" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981' }}>
                                        {formatCurrency(item.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>
                    No data available for monthly summary.
                </p>
            )}
        </div>
    );
}
