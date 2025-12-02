import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [score, setScore] = useState(null);
  const [title, setTitle] = useState("");
  const [rules, setRules] = useState([]);

  useEffect(() => {
    // Get last product from storage
    chrome.storage.local.get(["eco_lastProduct"], (data) => {
      if (data.eco_lastProduct) {
        const { title, score, breakdown } = data.eco_lastProduct;
        setTitle(title);
        setScore(score);
        setRules(breakdown || []);
      }
    });
  }, []);

  return (
    <div className="eco-popup">
      <h2 className="eco-title">EcoFindr Report</h2>

      <div className="score-box">
        <div className="score-value">{score ?? "–"}</div>
        <div className="score-label">EcoScore</div>
      </div>

      <h3 className="section-header">Product</h3>
      <p className="product-title">{title}</p>

      <h3 className="section-header">Score Breakdown</h3>
      <ul className="rule-list">
        {rules.length === 0 && <li>No data available.</li>}

        {rules.map((r, i) => (
          <li key={i}>
            <strong>{r.rule}</strong> → {r.delta}  
            <br />
            <span className="reason">{r.reason}</span>
          </li>
        ))}
      </ul>

      <div className="footer">
        Built for Hackathon ⚡ | EcoFindr
      </div>
    </div>
  );
}

export default App;
