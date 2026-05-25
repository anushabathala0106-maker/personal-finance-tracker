const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// In-memory storage for development when MongoDB is unavailable
let memoryTransactions = [];
let transactionId = 0;

function generateId() {
  return (++transactionId).toString();
}

// Check if we should use memory DB
function isMemoryDB() {
  return global.USE_MEMORY_DB === true;
}

router.get("/", async (req, res) => {
  try {
    const useMemory = global.USE_MEMORY_DB === true;
    console.log("[GET /] useMemory:", useMemory, "global.USE_MEMORY_DB:", global.USE_MEMORY_DB, "memTransactions:", memoryTransactions.length);
    
    if (useMemory) {
      const sorted = memoryTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log("[GET /] Returning", sorted.length, "transactions from memory");
      return res.json(sorted);
    }
    
    console.log("[GET /] Using MongoDB");
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("[GET /] Caught error:", error);
    res.status(500).json({ message: "Failed to fetch transactions", error: error.toString() });
  }
});

router.post("/", async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    console.log("[POST /transactions] Memory DB:", isMemoryDB(), "Payload:", { amount, type, category });
    
    if (isMemoryDB()) {
      const newTransaction = {
        _id: generateId(),
        amount: Number(amount),
        type,
        category,
        description: description || "",
        date: date ? new Date(date) : new Date(),
        createdAt: new Date(),
      };
      memoryTransactions.push(newTransaction);
      console.log("[POST /transactions] Saved. Total transactions:", memoryTransactions.length);
      return res.status(201).json(newTransaction);
    }
    
    const transaction = new Transaction({ amount, type, category, description, date });
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("[POST /transactions] Error:", error.message);
    res.status(400).json({ message: "Failed to create transaction", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (isMemoryDB()) {
      const index = memoryTransactions.findIndex((t) => t._id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      memoryTransactions[index] = { ...memoryTransactions[index], ...updateData, _id: id };
      return res.json(memoryTransactions[index]);
    }
    
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: "Failed to update transaction", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isMemoryDB()) {
      const index = memoryTransactions.findIndex((t) => t._id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      memoryTransactions.splice(index, 1);
      return res.json({ message: "Transaction deleted" });
    }
    
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transaction", error });
  }
});

module.exports = router;
