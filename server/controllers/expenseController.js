// controllers/expenseController.js

import Expense from "../models/Expense.js";
import { categorizeExpense } from "../utils/aiCategorizer.js";


// ➕ Add Expense
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category: customCategory, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const category = customCategory || await categorizeExpense(title);

    const expense = await Expense.create({
      title,
      amount,
      category,
      date: date || new Date(),
      user: req.user.id
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📥 Get All Expenses (Latest First)
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    console.log("Attempting to delete expense with ID:", req.params.id);
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      console.log("Expense not found for deletion:", req.params.id);
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this expense" });
    }

    await expense.deleteOne();
    console.log("Successfully deleted expense:", req.params.id);
    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    console.error("Error in deleteExpense controller:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✏️ Update Expense
export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category: customCategory, date } = req.body;

    const existingExpense = await Expense.findById(req.params.id);

    if (!existingExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check ownership
    if (existingExpense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this expense" });
    }

    let category = customCategory || existingExpense.category;

    // Re-categorize if title changed and no custom category provided
    if (title && title !== existingExpense.title && !customCategory) {
      category = await categorizeExpense(title);
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title: title || existingExpense.title,
        amount: amount || existingExpense.amount,
        category,
        date: date || existingExpense.date
      },
      { new: true }
    );

    res.json(updatedExpense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
