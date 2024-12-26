import React, { useEffect, useState } from "react";
import CardActions from "@mui/material/CardActions";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
} from "@mui/material";
const HomePage = () => {
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/hackathons")
      .then((response) => response.json())
      .then((data) => {
        setHackathons(data);
      })
      .catch((error) => console.error("Error fetching hackathons:", error));
  }, []);

  return (
    <div>
      <h1>Hackathons</h1>
      {/* {hackathons.map((hackathonData, index) => (
        <Card sx={{ minWidth: 275 }} key={index}>
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              {hackathonData.title}
            </Typography>
            <Typography variant="body2">{hackathonData.description}</Typography>
          </CardContent>
          <CardActions>
            <Button
              href={hackathonData.link}
              target="_blank"
              rel="noreferrer"
              size="small"
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
      ))} */}
       <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 800,
        margin: "auto",
      }}
    >
      {/* Left Section: Image */}
      <Box sx={{ width: 130, height: 130, marginRight: 1.5 }}>
        <img
          src="https://via.placeholder.com/100" // Replace with your image URL
          alt="Hackathon"
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          RAG 'n' ROLL Amp up Search with Snowflake & Mistral
        </Typography>
        <Grid container spacing={1} sx={{ marginTop:0.2 }}>
          {/* Left details */}
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              10 days left
            </Typography>
           
            <Typography variant="body2" fontWeight="bold">
              $10,000 in prize
            </Typography>
          </Grid>
          {/* Right details */}
          <Grid item xs={6} textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Online
            </Typography>
           
            <Typography variant="body2">
              1000 participants
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Actions and Tags */}
      <Box sx={{ marginLeft: 2, textAlign: "right" }}>
        <Chip label="Snowflake" size="small" />
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
          Nov 12, 2024 - Jan 14, 2025
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ marginTop: 1 }}
          href="#"
        >
          Learn More
        </Button>
      </Box>
    </Card>
    </div>
  );
};

export default HomePage;
