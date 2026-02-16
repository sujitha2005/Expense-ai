import { useState } from "react";
import API from "../api";
import { Plus, Zap } from "lucide-react";
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
  const [predictedCategory, setPredictedCategory] = useState(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  const handleAIAutofill = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    setIsLoadingCategory(true);
    try {
      const response = await API.post("/expenses/categorize", { title });
      setPredictedCategory(response.data.category);
      toast.success(`Category detected: ${response.data.category}`);
    } catch (error) {
      console.error("Error categorizing:", error);
      toast.error("Failed to detect category");
    } finally {
      setIsLoadingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/expenses", {
        title,
        amount: Number(amount),
        date,
      });

      setTitle("");
      setAmount("");
      setDate(getLocalDate());
      setPredictedCategory(null);
      toast.success("Expense added successfully!");
      if (fetchExpenses) fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
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

        {/* AI Category Prediction Section */}
        <div className="ai-autofill-section" style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={handleAIAutofill}
            disabled={isLoadingCategory || !title.trim()}
            className="ai-autofill-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: isLoadingCategory || !title.trim() ? "not-allowed" : "pointer",
              opacity: isLoadingCategory || !title.trim() ? 0.6 : 1,
              transition: "all 0.2s",
              fontSize: "0.875rem",
              fontWeight: "600"
            }}
          >
            <Zap size={16} />
            {isLoadingCategory ? "Detecting..." : "🤖 AI Autofill Category"}
          </button>

          {predictedCategory && (
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#ecfdf5",
                border: "1px solid #10b981",
                borderRadius: "0.5rem",
                color: "#047857",
                fontSize: "0.875rem",
                fontWeight: "500"
              }}
            >
              ✓ Predicted Category: <strong>{predictedCategory}</strong>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          <Plus size={20} />
          Add Expense
        </button>
      </form>
    </div>
  );
}
