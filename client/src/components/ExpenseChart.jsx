import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ expenses }) {

  const categoryMap = {};

  expenses.forEach(exp => {
    categoryMap[exp.category] =
      (categoryMap[exp.category] || 0) + exp.amount;
  });

  const COLORS = [
    "#16a34a", // Food - Green
    "#06b6d4", // Transport - Cyan
    "#ec4899", // Shopping - Pink
    "#eab308", // Bills - Yellow
    "#a855f7", // Entertainment - Purple
    "#10b981", // Health - Emerald
    "#f97316", // Education - Orange
    "#6b7280"  // Other - Gray
  ];

  const data = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: COLORS,
        borderColor: "#fff",
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: {
            size: 11,
            weight: 500
          },
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return "₹" + context.parsed.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h2>Category Distribution</h2>
      <div className="chart-wrapper">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
