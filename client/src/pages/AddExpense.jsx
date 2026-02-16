import ExpenseForm from "../components/ExpenseForm";
import RecentEntries from "../components/RecentEntries";
import { useExpenses } from "../context/ExpenseContext";
import "../styles/addexpense.css";

export default function AddExpense() {
  const { expenses, fetchExpenses } = useExpenses();

  return (
    <div className="add-expense-page">
      <div className="header-section">
        <h1 className="page-title">Add Expense</h1>
        <p className="page-subtitle">Record a new expense entry</p>
      </div>

      <ExpenseForm fetchExpenses={fetchExpenses} />

      <RecentEntries expenses={expenses} />
    </div>
  );
}
