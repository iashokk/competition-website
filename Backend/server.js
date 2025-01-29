const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const bcrypt = require("bcryptjs");
const puppeteer = require("puppeteer");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://metasync01:metasyncDB@hackathon-hub.nwy8q.mongodb.net/";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastEmailSent: { type: Date, default: null }, // Tracks the last email sent date
});
const User = mongoose.model("User", userSchema);


// Register Route (Hash password before saving)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save(); // Save the new user to the database
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); // Find user by email
    if (user && await bcrypt.compare(password, user.password)) { // Compare passwords
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

// Helper function to launch Puppeteer browser
const launchBrowser = async () => {
  return puppeteer.launch({ headless: true });
};


//mail notification
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iccis2025@gmail.com",
    pass: "regr cctb lstd viiu",    
  },
});

const sendHackathonEmails = async () => {
  try {
    // 1. Fetch all registered users from MongoDB
    const users = await User.find({}, "email"); // Get only email field

    // 2. Scrape or Fetch Hackathons (Ensure `getHackathons()` function exists)
    const hackathons = await getHackathons();
    const topHackathons = hackathons.slice(0, 2); // Pick top 2

    // 3. Email Configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "iccis2025@gmail.com",
        pass: "regr cctb lstd viiu", // Use an app-specific password
      },
    });

    // 4. Send an email to each registered user
    for (const user of users) {
      const mailOptions = {
        from: "iccis2025@gmail.com",
        to: user.email,
        subject: "🔥 Top 2 Upcoming Hackathons!",
        html: `
          <h2>🚀 Check out these exciting hackathons!</h2>
          <ul>
            ${topHackathons
              .map(
                (hackathon) => `
                <li>
                  <strong>${hackathon.title}</strong><br>
                  <b>Status:</b> ${hackathon.status}<br>
                  <b>Host:</b> ${hackathon.host}<br>
                  <b>Date:</b> ${hackathon.date}<br>
                  <b>Prize:</b> ${hackathon.prize}<br>
                  <b>Participants:</b> ${hackathon.participants}<br>
                  <b>Location:</b> ${hackathon.location}<br>
                  <b>More Info:</b> <a href="${hackathon.link}">${hackathon.link}</a>
                </li>
              `
              )
              .join("")}
          </ul>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent to ${user.email}`);
    }
  } catch (err) {
    console.error("❌ Error sending emails:", err);
  }
};
// Schedule this function to run every 3 days at 10 AM
// cron.schedule("0 10 */3 * *", () => {
//   console.log("⏳ Sending hackathon emails...");
//   sendHackathonEmails();
// });

cron.schedule("*/3 * * * * ", () => { 
  console.log("⏳ Sending hackathon emails (test mode)...");
  sendHackathonEmails();
});


app.post("/send-hackathon-emails", async (req, res) => {
  try {
    const users = await User.find(); // Get all registered users
    const hackathons = await getHackathons(); // Fetch hackathons using scraper

    const currentDate = new Date();

    for (const user of users) {
      // Check if 3 days have passed since the last email
      if (!user.lastEmailSent || (currentDate - new Date(user.lastEmailSent)) / (1000 * 60 * 60 * 24) >= 3) {
        await sendEmailWithHackathons(user.email, hackathons); // Send email
        user.lastEmailSent = currentDate; // Update timestamp
        await user.save(); // Save the updated timestamp
      }
    }

    res.status(200).json({ message: "Emails sent to eligible users" });
  } catch (err) {
    console.error("Error sending emails:", err);
    res.status(500).json({ message: "Error sending emails", error: err });
  }
});


















// Get Hackathons
const getHackathons = async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.goto("https://devpost.com/hackathons", { waitUntil: "networkidle2" });
  await page.waitForSelector(".hackathons-container .hackathon-tile");

  const hackathons = await page.evaluate(() => {
    const hackathonData = [];
    document.querySelectorAll(".hackathons-container .hackathon-tile").forEach((tile) => {
      const title = tile.querySelector(".main-content h3")?.textContent.trim();
      const status = tile.querySelector(".hackathon-status .status-label")?.textContent.trim();
      const host = tile.querySelector(".host .host-label")?.textContent.trim();
      const date = tile.querySelector(".submission-period")?.textContent.trim();
      const prize = tile.querySelector(".prize-amount")?.textContent.trim();
      const participants = tile.querySelector(".participants strong")?.textContent.trim();
      let image = tile.querySelector(".hackathon-thumbnail")?.getAttribute("src");
      const link = tile.querySelector("a")?.getAttribute("href");
      const location = tile.querySelector(".info-with-icon .info span")?.textContent.trim();
      if (image?.startsWith("//")) {
        image = `https:${image}`;
      }
      if (title && status && host && date && prize && participants && link && image && location) {
        hackathonData.push({ title, status, host, date, prize, participants, link, image, location });
      }
    });
    return hackathonData;
  });

  await browser.close();
  return hackathons;
};

app.get("/api/hackathons", async (req, res) => {
  try {
    const hackathons = await getHackathons();
    res.status(200).json(hackathons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hackathons", error: err });
  }
});

// Scrape Mentors
const scrapeMentors = async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.goto("https://unstop.com/mentor", { waitUntil: "load", timeout: 0 });
  await page.waitForSelector("a.item.ng-star-inserted", { timeout: 10000 });

  const mentors = await page.evaluate(() => {
    const mentorData = [];
    document.querySelectorAll("a.item.ng-star-inserted").forEach((item) => {
      const name = item.querySelector("h3 .single-wrap")?.textContent.trim();
      const rating = item.querySelector("h3 span")?.textContent.trim();
      const description = item.querySelector("p.double-wrap")?.textContent.trim();
      const profileImage = item.querySelector(".img img")?.getAttribute("src");
      const profileLink = item.getAttribute("href");
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
};

app.get("/api/mentors", async (req, res) => {
  try {
    const mentors = await scrapeMentors();
    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching mentors", error: err });
  }
});

// Get Blogs
const getBlogs = async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.goto("https://info.devpost.com/blog", { waitUntil: "networkidle0" });

  const blogs = await page.evaluate(() => {
    const blogData = [];
    document.querySelectorAll(".article-grid-item").forEach((tile) => {
      const title = tile.querySelector(".blog-heading")?.textContent.trim();
      const description = tile.querySelector(".article-card-snippet")?.textContent.trim();
      const category = tile.querySelector(".category-label")?.textContent.trim();
      const image = tile.querySelector(".article-thumbnail img")?.getAttribute("src");
      const link = tile.querySelector("a")?.getAttribute("href");
      if (title && description && category && image && link) {
        blogData.push({
          title,
          description,
          category,
          image: image.startsWith("//") ? `https:${image}` : image,
          link: link.startsWith("/") ? `https://info.devpost.com${link}` : link,
        });
      }
    });
    return blogData;
  });

  await browser.close();
  return blogs;
};

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await getBlogs();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs", error: err.message });
  }
});

// Get Internships
const getInternships = async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.goto("https://internshala.com/internships/internship-in-bangalore/", { waitUntil: "networkidle2", timeout: 60000 });

  try {
    await page.waitForSelector(".individual_internship", { timeout: 30000 });

    const internships = await page.evaluate(() => {
      const internshipData = [];
      document.querySelectorAll(".individual_internship").forEach((internship) => {
        const title = internship.querySelector(".job-internship-name a")?.textContent.trim();
        const company = internship.querySelector(".company-name")?.textContent.trim();
        const activelyHiring = internship.querySelector(".actively-hiring-badge") ? true : false;
        const location = internship.querySelector(".locations a")?.textContent.trim();
        const duration = internship.querySelector(".row-1-item:nth-child(2) span")?.textContent.trim();
        const stipend = internship.querySelector(".stipend")?.textContent.trim();
        const postedAgo = internship.querySelector(".status-inactive span")?.textContent.trim();
        const link = internship.querySelector(".job-internship-name a")?.getAttribute("href");
        const logo = internship.querySelector(".internship_logo img")?.getAttribute("src");
        if (title && company && location && duration && stipend && postedAgo && link) {
          internshipData.push({
            title,
            company,
            activelyHiring,
            location,
            duration,
            stipend,
            postedAgo,
            link: `https://internshala.com${link}`,
            logo,
          });
        }
      });
      return internshipData;
    });

    await browser.close();
    return internships;
  } catch (err) {
    console.error("Error scraping internships:", err);
    await browser.close();
    return [];
  }
};

app.get("/api/internships", async (req, res) => {
  try {
    const internships = await getInternships();
    res.status(200).json(internships);
  } catch (err) {
    res.status(500).json({ message: "Error fetching internships", error: err.message });
  }
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
