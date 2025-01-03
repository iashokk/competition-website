const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://metasync01:metasyncDB@hackathon-hub.nwy8q.mongodb.net/";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Register Route (Hash password before saving)
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// Get Hackathons
const getHackathons = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://devpost.com/hackathons', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.hackathons-container .hackathon-tile');

  const hackathons = await page.evaluate(() => {
    const hackathonData = [];
    document.querySelectorAll('.hackathons-container .hackathon-tile').forEach(tile => {
      const title = tile.querySelector('.main-content h3')?.textContent.trim();
      const status = tile.querySelector('.hackathon-status .status-label')?.textContent.trim();
      const host = tile.querySelector('.host .host-label')?.textContent.trim();
      const date = tile.querySelector('.submission-period')?.textContent.trim();
      const prize = tile.querySelector('.prize-amount')?.textContent.trim();
      const participants = tile.querySelector('.participants strong')?.textContent.trim();
      let image = tile.querySelector('.hackathon-thumbnail')?.getAttribute('src');
      const link = tile.querySelector('a')?.getAttribute('href');
      const location = tile.querySelector('.info-with-icon .info span')?.textContent.trim();
      if (image?.startsWith('//')) {
        image = `https:${image}`;
      }
      if (title && status && host && date && prize && participants && link && image && location) {
        hackathonData.push({
          title,
          status,
          host,
          date,
          prize,
          participants,
          link,
          image,
          location
        });
      }
    });
    return hackathonData;
  });

  await browser.close();
  return hackathons;
};

app.get('/api/hackathons', async (req, res) => {
  try {
    const hackathons = await getHackathons();
    res.status(200).json(hackathons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hackathons', error: err });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
