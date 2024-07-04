const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const words = ["javascript", "react", "express", "node","mongodb"];

app.get('/word', (req, res) => {
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  res.json({ word });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
