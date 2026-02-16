import { useMemo } from "react";
import {
  Chart ,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useExpenses } from "../context/ExpenseContext";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const CHART_COLORS = [
  "hsl(168, 65%, 38%)",
  "hsl(38, 92%, 55%)",
  "hsl(262, 60%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(340, 65%, 55%)",
  "hsl(120, 50%, 45%)",
  "hsl(30, 80%, 50%)",
  "hsl(280, 50%, 60%)",
];

export const PieChart = () => {
  const { expenses } = useExpenses();

  const data = useMemo(() => {
    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: CHART_COLORS.slice(0, labels.length),
          borderWidth,
          borderColor: "hsl(0, 0%, 100%)",
        },
      ],
    };
  }, [expenses]);

  return (
    <div className="glass-card p-6 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Category Distribution</h3>
      <div className="max-w-xs mx-auto">
        <Pie
          data={data}
          options={{
            responsive,
            plugins: {
              legend: {
                position: "bottom",
                labels: { padding, usePointStyle, pointStyleWidth },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => `₹${ctx.parsed.toLocaleString("en-IN")}`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export const BarChart = () => {
  const { expenses } = useExpenses();

  const data = useMemo(() => {
    const monthMap = {};
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      monthMap[key] = (monthMap[key] || 0) + e.amount;
    });

    const sorted = Object.entries(monthMap).sort((a, b) => {
      const da = new Date(a[0]);
      const db = new Date(b[0]);
      return da.getTime() - db.getTime();
    });

    return {
      labels: sorted.map(([k]) => k),
      datasets: [
        {
          label: "Monthly Expenses (₹)",
          data: sorted.map(([, v]) => v),
          backgroundColor: "hsl(168, 65%, 38%)",
          borderRadius,
          barThickness,
        },
      ],
    };
  }, [expenses]);

  return (
    <div className="glass-card p-6 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Report</h3>
      <Bar
        data={data}
        options={{
          responsive,
          plugins: {
            legend: { display },
            tooltip: {
              callbacks: {
                label: (ctx) => `₹${ctx.parsed.y.toLocaleString("en-IN")}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero,
              ticks: {
                callback: (val) => `₹${Number(val).toLocaleString("en-IN")}`,
              },
              grid: { color: "hsl(210, 15%, 93%)" },
            },
            x: {
              grid: { display },
            },
          },
        }}
      />
    </div>
  );
};


