const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let transactions = [];
let transactionId = 0;

app.get("/", (req, res) => {
  res.json({ status: "OK", db: "memory", txnCount: transactions.length });
});

app.get("/transactions", (req, res) => {
  console.log("GET /transactions called");
  res.json(transactions);
});

app.post("/transactions", (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const newTxn = {
      _id: (++transactionId).toString(),
      amount: Number(amount),
      type,
      category,
      description: description || "",
      date: date ? new Date(date) : new Date(),
    };
    transactions.push(newTxn);
    console.log("Transaction saved:", newTxn._id);
    res.status(201).json(newTxn);
  } catch (err) {
    console.error("POST error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.delete("/transactions/:id", (req, res) => {
  const idx = transactions.findIndex((t) => t._id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "Not found" });
  const deleted = transactions.splice(idx, 1);
  res.json(deleted[0]);
});

app.put("/transactions/:id", (req, res) => {
  const idx = transactions.findIndex((t) => t._id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "Not found" });
  transactions[idx] = { ...transactions[idx], ...req.body, _id: req.params.id };
  res.json(transactions[idx]);
});

app.listen(5000, () => {
  console.log("✓ Server on port 5000 (in-memory mode)");
});
