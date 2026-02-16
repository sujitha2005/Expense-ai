import { useEffect, useState } from "react";
import API from "../api";
import MonthlyChart from "../components/MonthlyChart";
import CategoryChart from "../components/CategoryChart";
import CategoryBreakdown from "../components/CategoryBreakdown";
import MonthlyBreakdown from "../components/MonthlyBreakdown";
import "../styles/reports.css";

export default function Reports() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get("/expenses");
        setExpenses(res.data);
      } catch (error) {
        console.error("Error fetching expenses for reports:", error);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="reports-page">
      <h1 className="page-title">Spending Reports</h1>

      <div className="reports-grid">
        <CategoryChart expenses={expenses} />
        <CategoryBreakdown expenses={expenses} />
      </div>

      <div className="reports-grid" style={{ marginTop: "2rem" }}>
        <MonthlyChart expenses={expenses} />
        <MonthlyBreakdown expenses={expenses} />
      </div>
    </div>
  );
}
