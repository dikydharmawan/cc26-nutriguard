const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'NutriGuard API is running', status: 'ok' });
});

// Placeholder: Scan endpoint (akan diisi tim Data Science & AI)
// POST /api/scan
// Body: { image: base64string }
// Response: { isValid, productName, resultStatus, confidence, nutrients, aiSuggestion, ... }
app.post('/api/scan', (req, res) => {
  // TODO: Integrasi dengan model AI/ML dari tim Data Science
  res.status(501).json({
    message: 'Endpoint ini akan diimplementasikan oleh tim Data Science & AI.',
    status: 'not_implemented'
  });
});

app.listen(PORT, () => {
  console.log(`NutriGuard Server running on http://localhost:${PORT}`);
});
