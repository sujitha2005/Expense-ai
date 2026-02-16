import { useState } from "react";
import API from "../api";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function ExpenseForm({ fetchExpenses }) {
  const getLocalDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getLocalDate());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post("/expenses", {
        title,
        amount: Number(amount),
        date,
      });

      setTitle("");
      setAmount("");
      setDate(getLocalDate());
      toast.success("Expense added successfully!");
      if (fetchExpenses) fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="expense-form-card">
      <h2 className="section-title">New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              placeholder="e.g. Grocery Shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          <Plus size={20} />
          {isLoading ? "Adding..." : "Add Expense"}
        </button>
      </form>
      <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem", textAlign: "center" }}>
        💡 Category will be automatically detected based on your title
      </p>
    </div>
  );
}
