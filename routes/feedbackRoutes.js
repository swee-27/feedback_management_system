const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFile = path.join(__dirname, '..', 'data', 'feedback.json');

// Helper - read file safely
function readData() {
  try {
    const content = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    return [];
  }
}

// GET /feedback  -> list all feedback
router.get('/', (req, res) => {
  const data = readData();
  res.json(data);
});

// POST /feedback -> add feedback
router.post('/', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'name and message are required' });
  }

  const data = readData();
  const newFeedback = {
    id: data.length + 1,
    name,
    message,
    date: new Date().toISOString()
  };

  data.push(newFeedback);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.status(201).json({ message: 'Feedback received!', feedback: newFeedback });
});

module.exports = router;
