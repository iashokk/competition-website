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


async function scrapeMentors() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the Unstop Mentor page
  await page.goto('https://unstop.com/mentor', { waitUntil: 'load', timeout: 0 });
// Wait for mentor elements to load
await page.waitForSelector('a.item.ng-star-inserted', { timeout: 10000 });
  // Scrape mentor data
  const mentors = await page.evaluate(() => {
    const mentorData = [];

    // Loop through each mentor item
    document.querySelectorAll('a.item.ng-star-inserted').forEach(item => {
      const name = item.querySelector('h3 .single-wrap')?.textContent.trim();
      const rating = item.querySelector('h3 span')?.textContent.trim();
      const description = item.querySelector('p.double-wrap')?.textContent.trim();
      const profileImage = item.querySelector('.img img')?.getAttribute('src');
      const profileLink = item.getAttribute('href');

      if (name && description && profileImage && profileLink) {
        mentorData.push({
          name,
          rating,
          description,
          profileImage,
          profileLink: `https://unstop.com${profileLink}`,
        });
      }
    });

    return mentorData;
  });

  await browser.close();
  return mentors;
}

// Run the script and log the result
scrapeMentors()
  .then(mentors => console.log("mentors",mentors))
  .catch(err => console.error(err));
  app.get('/api/mentors', async (req, res) => {
    try {
      const mentors = await scrapeMentors();
      res.status(200).json(mentors);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching mentors', error: err });
    }
  });


//blogs
// Function to scrape blog data
const getBlogs = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the Devpost blog page
  await page.goto('https://info.devpost.com/blog', { waitUntil: 'networkidle0' });
  
  // Scrape mentor data
  // Scrape blog data
  const blogs = await page.evaluate(() => {
    const blogData = [];
    document.querySelectorAll('.article-grid-item').forEach(tile => {
      const title = tile.querySelector('.blog-heading')?.textContent.trim();
      const description = tile.querySelector('.article-card-snippet')?.textContent.trim();
      const category = tile.querySelector('.category-label')?.textContent.trim();
      const image = tile.querySelector('.article-thumbnail img')?.getAttribute('src');
      const link = tile.querySelector('a')?.getAttribute('href');
      
      // Ensure the data is valid
      if (title && description && category && image && link) {
        blogData.push({
          title,
          description,
          category,
          image: image.startsWith('//') ? `https:${image}` : image,
          link: link.startsWith('/') ? `https://info.devpost.com${link}` : link
        });
      }
    });
    return blogData;
  });

  await browser.close();
  return blogs;
};

// API Endpoint
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await getBlogs();
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
});

//webinars 

const getWebinars = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.mygreatlearning.com/webinars', { waitUntil: 'networkidle2', timeout: 60000 });

  try {
    // Wait for the '.each-card' elements to appear with a timeout
    await page.waitForSelector('.each-card', { timeout: 30000 });
    console.log("Elements found");
  } catch (err) {
    console.error('Error: Element not found or taking too long to load:', err);
    await browser.close();
    return [];
  }

  // Debug: Check if any card is found on the page
  const htmlContent = await page.content();
  console.log(htmlContent);  // This will log the HTML content of the page

  const webinars = await page.evaluate(() => {
    const webinarData = [];
    document.querySelectorAll('.each-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent.trim();
      const date = card.querySelector('h5')?.textContent.trim();
      const organization = card.querySelector('h4')?.textContent.trim();
      const description = card.querySelector('p')?.textContent.trim();
      let image = card.querySelector('.img-wrapper')?.style.backgroundImage;
      const link = card.querySelector('a')?.getAttribute('href');
      
      if (image) {
        image = image.replace('url(', '').replace(')', '').replace(/"/g, '');
      }
      
      if (title && date && organization && description && image && link) {
        webinarData.push({
          title,
          date,
          organization,
          description,
          image,
          link
        });
      }
    });
    return webinarData;
  });

  console.log("Webinars:", webinars); // Debugging the fetched webinar data

  await browser.close();
  return webinars;
};

app.get('/api/webinars', async (req, res) => {
  try {
    const webinars = await getWebinars();
    res.status(200).json(webinars);
    console.log(webinars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching webinars', error: err });
  }
});






// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
