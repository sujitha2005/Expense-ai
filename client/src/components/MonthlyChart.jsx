import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function MonthlyChart({ expenses }) {

  const monthMap = {};

  expenses.forEach(exp => {
    const month = new Date(exp.date).toLocaleString("default", {
      month: "short",
      year: "numeric"
    });

    monthMap[month] = (monthMap[month] || 0) + exp.amount;
  });

  const data = {
    labels: Object.keys(monthMap),
    datasets: [
      {
        label: "Monthly Expenses",
        data: Object.values(monthMap),
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        maxBarThickness: 50,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return "₹" + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "₹" + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h2>Monthly Report</h2>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
