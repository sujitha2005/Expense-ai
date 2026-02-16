import { useState } from "react";
import API from "../api";
import EditModal from "./EditModal";
import toast from "react-hot-toast";

export default function ExpenseList({ expenses, refreshExpenses }) {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleDelete = async (id) => {
    await API.delete(`/expenses/${id}`);
    toast.success("Expense deleted!");
    refreshExpenses();
  };

  return (
    <div>
      {expenses.map((exp) => (
        <div key={exp._id} className="expense-row">
          <span>{exp.title}</span>
          <span>₹{exp.amount}</span>
          <span>{exp.category}</span>

          <div>
            <button
              className="edit-btn"
              onClick={() => setSelectedExpense(exp)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(exp._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {selectedExpense && (
        <EditModal
          expense={selectedExpense}
          closeModal={() => setSelectedExpense(null)}
          refreshExpenses={refreshExpenses}
        />
      )}
    </div>
  );
}
