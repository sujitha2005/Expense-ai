import { useState } from "react";
import API from "../api";
import { Plus } from "lucide-react";

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
  const [category, setCategory] = useState("Food");

  const categories = ["Food", "Transport", "Entertainment", "Bills", "Health", "Education", "Other"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/expenses", {
        title,
        amount: Number(amount),
        date,
        category,
      });

      setTitle("");
      setAmount("");
      setDate(getLocalDate());
      setCategory("Food");
      if (fetchExpenses) fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
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

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          <Plus size={20} />
          Add Expense
        </button>
      </form>
    </div>
  );
}
