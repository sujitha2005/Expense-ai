// src/pages/Settings.jsx

import { useState } from "react";
import "../styles/settings.css";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState("INR");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    if (!darkMode) {
      document.body.style.backgroundColor = "#111827";
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "#f3f4f6";
      document.body.style.color = "black";
    }
  };

  return (
    <div>
      <h2 className="settings-title">Settings</h2>

      <div className="settings-card">

        <div className="settings-item">
          <label>Dark Mode</label>
          <button onClick={toggleDarkMode}>
            {darkMode ? "Disable" : "Enable"}
          </button>
        </div>

        <div className="settings-item">
          <label>Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>

        <div className="settings-item">
          <label>User Profile</label>
          <p>Profile settings coming soon...</p>
        </div>

      </div>
    </div>
  );
}
