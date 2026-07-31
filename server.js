require('dotenv').config();
const path = require('path');
const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//  Connecting  to MongoDB
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.log('⚠ MongoDB offline - using fallback memory:', err.message));
//  Database 
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model('User', UserSchema);
const ScoreSchema = new mongoose.Schema({
  userEmail: String,
  category: String,
  score: Number,
  percentage: Number,
  date: { type: Date, default: Date.now }
});
const Score = mongoose.model('Score', ScoreSchema);
// API Routes
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  await newUser.save();
  res.json({ message: 'User registered successfully!' });
});
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
});
app.post('/api/scores', async (req, res) => {
  const { userEmail, category, score, percentage } = req.body;
  const newScore = new Score({ userEmail, category, score, percentage });
  await newScore.save();
  res.json({ message: 'Score saved to MongoDB!' });
});
app.get('/api/scores', async (req, res) => {
  const scores = await Score.find();
  res.json(scores);
});
//  Starting  Server
app.listen(5000, () => {
  console.log('🚀 Express Server running on http://localhost:5000');
});
