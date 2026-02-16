import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

export const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"];

const ExpenseContext = createContext(undefined);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);



  const addExpense = async (expenseData) => {
    try {
      const res = await API.post("/expenses", expenseData);
      setExpenses((prev) => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      console.error("Error adding expense in context:", error);
      throw error;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => (exp._id || exp.id) !== id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense in context:", error);
      const msg = error.response?.data?.message || error.message || "Failed to delete expense";
      toast.error(msg);
      throw error;
    }
  };

  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) {
      setExpenses([]);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses in context:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  return (
    <ExpenseContext.Provider value={{ expenses, loading, fetchExpenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};


export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpenseProvider");
  return ctx;
};




