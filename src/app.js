const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Practical 9 Caching Service' });
});

module.exports = app;