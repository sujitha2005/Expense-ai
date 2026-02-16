import jsPDF from "jspdf";
import Papa from "papaparse";
import { Download, FileText } from "lucide-react";

export default function ExportButtons({ expenses = [] }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, 30);

    let yPos = 40;

    // Headers
    doc.setFillColor(240, 240, 240);
    doc.rect(14, yPos - 5, 182, 10, "F");
    doc.setFont(undefined, "bold");
    doc.text("Title", 16, yPos);
    doc.text("Category", 80, yPos);
    doc.text("Date", 120, yPos);
    doc.text("Amount", 170, yPos);
    yPos += 10;
    doc.setFont(undefined, "normal");

    expenses.forEach((exp) => {
      // Check for page break
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }

      const title = exp.title.length > 25 ? exp.title.substring(0, 22) + "..." : exp.title;
      doc.text(title, 16, yPos);
      doc.text(exp.category || "-", 80, yPos);
      doc.text(new Date(exp.date).toLocaleDateString(), 120, yPos);
      doc.text(`Rs. ${exp.amount}`, 170, yPos);

      yPos += 10;
    });

    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    doc.setFont(undefined, "bold");
    doc.text(`Total: Rs. ${total.toLocaleString()}`, 140, yPos + 5);

    doc.save("expenses.pdf");
  };

  const exportCSV = () => {
    // Format data for CSV
    const csvData = expenses.map(exp => ({
      Title: exp.title,
      Amount: exp.amount,
      Date: new Date(exp.date).toISOString().split('T')[0],
      Category: exp.category
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "expenses.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="export-buttons-container">
        <button onClick={exportCSV} className="export-btn btn-csv" disabled={expenses.length === 0}>
          <FileText size={18} />
          Export CSV
        </button>
        <button onClick={exportPDF} className="export-btn btn-pdf" disabled={expenses.length === 0}>
          <Download size={18} />
          Export PDF
        </button>
      </div>
      <p className="export-info">
        {expenses.length} expense(s) will be exported.
      </p>
    </div>
  );
}
