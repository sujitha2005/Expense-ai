import Papa from "papaparse";
import API from "../api";
import { Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function CSVImport({ refreshExpenses }) {
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async function (results) {
                let count = 0;
                let errors = 0;

                const importedItems = [];
                const promises = [];

                for (let row of results.data) {
                    // Flexible field matching (case insensitive)
                    const title = row.title || row.Title || row.TITLE;
                    const amount = row.amount || row.Amount || row.AMOUNT;
                    const date = row.date || row.Date || row.DATE || new Date().toISOString().split('T')[0];
                    const category = row.category || row.Category || row.CATEGORY || "Other";

                    if (title && amount) {
                        const expenseData = {
                            title,
                            amount: Number(amount),
                            date,
                            category
                        };

                        // Add to DB
                        const promise = API.post("/expenses", expenseData)
                            .then(res => {
                                count++;
                                // Use the response data if available (has ID), else use input
                                importedItems.push(res.data || expenseData);
                            })
                            .catch(err => {
                                console.error("Failed to import row:", row, err);
                                errors++;
                            });

                        promises.push(promise);
                    }
                }

                await Promise.all(promises);

                if (count > 0) {
                    toast.success(`Successfully imported ${count} expenses!`);
                    if (refreshExpenses) refreshExpenses(importedItems, file.name);
                }

                if (errors > 0) {
                    toast.error(`Failed to import ${errors} rows.`);
                }

                // Reset input
                e.target.value = null;
            },
            error: function (err) {
                toast.error("Error parsing CSV file.");
                console.error(err);
            }
        });
    };

    return (
        <div className="file-upload-wrapper">
            <input
                type="file"
                accept=".csv"
                onChange={handleFile}
                id="csv-upload"
                className="file-input"
            />
            <label htmlFor="csv-upload" className="file-label">
                <FileText size={18} />
                Choose File
            </label>
        </div>
    );
}
