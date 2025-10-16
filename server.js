const express = require('express');
const app = express();
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use(express.json());

// Use /feedback routes
app.use('/feedback', feedbackRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Feedback Management System is Running!');
});
//port
const PORT = process.env.PORT || 3000;
app.listen(3000,'0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
