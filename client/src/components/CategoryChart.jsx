import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ expenses = [] }) {
    // Aggregate expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
        const { category, amount } = expense;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const dataValues = Object.values(categoryTotals);

    // Colors matching badges/progress bars
    const backgroundColors = labels.map((cat) => {
        switch (cat) {
            case "Food": return "#16a34a";
            case "Transport": return "#06b6d4";
            case "Entertainment": return "#a855f7";
            case "Bills": return "#eab308";
            case "Health": return "#10b981";
            case "Education": return "#f97316";
            default: return "#6b7280";
        }
    });

    const data = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                    }
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
    };

    return (
        <div className="reports-card">
            <h3 className="section-title">Category Distribution</h3>
            {expenses.length > 0 ? (
                <div style={{ height: "250px", position: "relative", width: "100%" }}>
                    <Pie data={data} options={options} />
                </div>
            ) : (
                <div className="empty-state" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p>No data available</p>
                </div>
            )}
        </div>
    );
}
