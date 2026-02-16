import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const VALID_CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Other"
];

// Fallback keyword-based categorizer if API fails
const keywordCategorize = (title) => {
  const keywords = {
    Food: ["food", "restaurant", "cafe", "pizza", "burger", "lunch", "dinner", "breakfast", "coffee", "tea", "meal", "snack", "grocery", "supermarket", "vegetable", "fruit", "produce", "eat", "chicken", "rice", "bread", "milk", "egg", "fish", "chocolate", "sweet", "dessert", "pastry", "restaurant", "donut", "cake", "biscuit", "cookie", "juice", "drink", "beverage", "soup", "noodle", "pasta"],
    Travel: ["uber", "taxi", "flight", "hotel", "bus", "train", "car", "gas", "parking", "airplane", "travel", "ride", "transport", "commute"],
    Rent: ["rent", "lease", "mortgage", "landlord", "apartment", "house"],
    Shopping: ["shop", "store", "mall", "amazon", "online", "clothes", "apparel", "book", "gift", "buy", "dress", "shirt", "pants", "shoe", "shoes", "jacket", "purchase"],
    Utilities: ["electric", "water", "gas", "internet", "phone", "bill", "utility", "electricity", "broadband"],
    Entertainment: ["movie", "cinema", "concert", "theater", "game", "music", "spotify", "netflix", "show", "entertainment", "ticket", "play", "film"],
  };

  const lowerTitle = title.toLowerCase();
  for (const [category, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (lowerTitle.includes(word)) {
        return category;
      }
    }
  }
  return "Other";
};

export const categorizeExpense = async (title) => {
  try {
    if (!process.env.GEMINI_KEY) {
      console.log("GEMINI_KEY not found, using fallback categorizer");
      return keywordCategorize(title);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Classify this expense into ONE of these categories: Food, Travel, Rent, Shopping, Utilities, Entertainment, Other. Expense: "${title}". Respond with ONLY the category word.`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    console.log("Gemini Response:", rawText);

    const lowerText = rawText.toLowerCase();
    const matchedCategory = VALID_CATEGORIES.find(category =>
      lowerText.includes(category.toLowerCase())
    );

    return matchedCategory || "Other";

  } catch (error) {
    console.log("Gemini API Error:", error.message);
    console.log("Falling back to keyword-based categorization");
    return keywordCategorize(title);
  }

};
