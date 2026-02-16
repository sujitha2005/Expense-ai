import { useState } from "react";
import API from "../api";
import toast from "react-hot-toast";

export default function EditModal({ expense, closeModal, refreshExpenses }) {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);

  const handleUpdate = async () => {
    await API.put(`/expenses/${expense._id}`, {
      title,
      amount
    });

    toast.success("Expense updated!");
    refreshExpenses();
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Expense</h3>

        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleUpdate}>Save</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
