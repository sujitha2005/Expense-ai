import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  categorizeExpensePreview
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// 🤖 Categorize (AI preview)
router.post("/categorize", categorizeExpensePreview);

// ➕ Create expense
router.post("/", addExpense);

// 📥 Get all expenses
router.get("/", getExpenses);

// ❌ Delete expense
router.delete("/:id", deleteExpense);

// ✏️ Update expense
router.put("/:id", updateExpense);




export default router;
