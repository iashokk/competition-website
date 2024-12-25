// Backend (Node.js with Express):
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();;
const bcrypt = require('bcryptjs');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = "mongodb+srv://metasync01:metasyncDB@hackathon-hub.nwy8q.mongodb.net/";
console.log('Mongo URI:', mongoURI);
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
});
const User = mongoose.model('User', userSchema);

// Register Route (Hash password before saving)
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
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

//Get Hackthons

const puppeteer = require('puppeteer');

const getHackathons = async () => {
  const browser = await puppeteer.launch({ headless: true }); // Launch the browser
  const page = await browser.newPage();
  
  // Go to the Devpost Hackathon page
  await page.goto('https://devpost.com/hackathons', { waitUntil: 'networkidle2' });

  // Wait for the hackathon elements to be loaded
  await page.waitForSelector('.hackathons-container .hackathon-tile');
  
  // Extract the hackathon data from the rendered page
  const hackathons = await page.evaluate(() => {
    const hackathonData = [];
    
    // Loop through each hackathon tile
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
          link ,
          image,
          location
        });
      }
    });
    console.log(hackathonData);
    return hackathonData;
  });

  await browser.close(); // Close the browser after scraping

  return hackathons;
};

// Call the function and log the results
getHackathons().then(hackathons => console.log(hackathons)).catch(err => console.error(err));

app.get('/api/hackathons', async (req, res) => {
try {
    const hackathons = await getHackathons();
    res.status(200).json(hackathons);
} catch (err) {
    res.status(500).json({ message: 'Error fetching hackathons', error: err });
}
});
// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
