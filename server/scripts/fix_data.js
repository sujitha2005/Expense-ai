import mongoose from "mongoose";
import dotenv from "dotenv";
import Expense from "../models/Expense.js";

dotenv.config();

const fixExpenses = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("MONGO_URI not found in environment");
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB...");

        const titlesToFix = ["chocolate", "vegetable"];
        const result = await Expense.updateMany(
            {
                title: { $in: titlesToFix.map(t => new RegExp(`^${t}$`, 'i')) },
                category: "Other"
            },
            { category: "Food" }
        );

        console.log(`Successfully updated ${result.modifiedCount} expenses.`);

        // Show updated entries
        const updated = await Expense.find({
            title: { $in: titlesToFix.map(t => new RegExp(`^${t}$`, 'i')) }
        });
        console.log("Recently fixed entries:", updated);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error fixing data:", error);
        process.exit(1);
    }
};

fixExpenses();
