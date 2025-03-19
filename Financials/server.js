const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = 'db.json';

app.use(cors());
app.use(bodyParser.json());
// Serve static files from the 'public' folder (where you can place index.html, style.css, script.js)
app.use(express.static('public'));

// Helper functions to read and write the JSON database
function readAccounts() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
}

function writeAccounts(accounts) {
  fs.writeFileSync(DB_FILE, JSON.stringify(accounts, null, 2));
}

// GET endpoint: Retrieve all accounts
app.get('/api/accounts', (req, res) => {
  const accounts = readAccounts();
  res.json(accounts);
});

// POST endpoint: Add a new account
app.post('/api/accounts', (req, res) => {
  let accounts = readAccounts();
  const account = req.body;
  accounts.push(account);
  writeAccounts(accounts);
  res.json({ success: true });
});

// PUT endpoint: Update an account by index
app.put('/api/accounts/:index', (req, res) => {
  let accounts = readAccounts();
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < accounts.length) {
    accounts[index] = req.body;
    writeAccounts(accounts);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Account not found" });
  }
});

// DELETE endpoint: Delete an account by index
app.delete('/api/accounts/:index', (req, res) => {
  let accounts = readAccounts();
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < accounts.length) {
    accounts.splice(index, 1);
    writeAccounts(accounts);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Account not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
