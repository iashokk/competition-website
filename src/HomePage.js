import React, { useEffect, useState } from "react";
import { Card, Typography, Box, Button, Chip, Divider , CardActions, CardContent} from "@mui/material";
import TourOutlinedIcon from "@mui/icons-material/TourOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LanguageIcon from "@mui/icons-material/Language";
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
     {hackathons.map((hackathonData, index) => (
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderRadius: 2,
          boxShadow: 0.5,
          maxWidth: 800,
          margin: "auto",
          marginBottom: 4,
        }}
        key={index}
      >
        {/* Left Section: Image */}
        <Box sx={{ width: 140, height: 140, marginRight: 2 }}>
          <img
            src={hackathonData.image} // Replace with your image URL
            alt="Hackathon"
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="bold">
          {hackathonData.title}
          </Typography>
          <Box sx={{ marginTop: 1 }}>
            {/* First Row: 10 Days Left and Online */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", // Align vertically
                marginBottom: 1,
                marginRight: 2,
              }}
            >
              <Chip label={hackathonData.status} size="medium" />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LanguageIcon sx={{ marginRight: 1, fontSize: 18 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="right"
                  fontSize={14.5}
                >
                 {hackathonData.location}
                </Typography>
              </Box>
            </Box>

            {/* Second Row: Prize and Participants */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", // Align vertically
              }}
            >
              <Typography variant="body2" fontWeight="bold" fontSize={14.5}>
                {hackathonData.prize} in Prize
              </Typography>

              <Typography variant="body2" textAlign="right" fontSize={14.5}>
                {hackathonData.participants} Participants
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            marginX: 2,
            backgroundColor: "rgba(0, 0, 0, 0.2)", // Color of the divider
          }}
        />
        {/* Actions and Tags */}
        <Box sx={{ marginLeft: 1, textAlign: "left" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TourOutlinedIcon sx={{ marginRight: 1, fontSize: 18 }} />
            <Chip label={hackathonData.host} size="medium" />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <CalendarTodayOutlinedIcon
              sx={{ marginRight: 1, fontSize: 18, marginTop: 1 }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginTop: 1, fontSize: 14 }}
            >
              {hackathonData.date}
            </Typography>
          </Box>
          <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="small"
              sx={{ marginTop: 1, borderRadius: 20 }}
              href={hackathonData.link}
              target="_blank"
              rel="noreferrer"
            >
              Register
            </Button>
          </Box>
        </Box>
      </Card>
      ))}
    </div>
    
  );
};

export default HomePage;
