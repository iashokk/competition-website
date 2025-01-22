import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Avatar, Button, Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import StarIcon from "@mui/icons-material/Star";
import BoltIcon from "@mui/icons-material/Bolt";
import Navbar from "./NavBar";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  borderRadius: theme.spacing(2),
  boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  position: "relative",
  margin: theme.spacing(2),
}));

const AvailabilityBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: "black",
  color: "white", 
  borderRadius: theme.spacing(1), 
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1),
  fontSize: "0.75rem",
  fontWeight: "bold",
}));

const TrophyBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  
  borderRadius: "50%",
  width: 30,
  height: 30,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export default function MentorCards() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/mentors") // Replace with your endpoint
      .then((response) => response.json())
      .then((data) => {
        setMentors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mentors:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <Navbar/>
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }} style={{
      backgroundColor: 'white',
      backgroundImage: 'url(/Background.png)',
      position: 'relative',
      backgroundSize: 'cover', // Ensures the image covers the container
      backgroundRepeat: 'no-repeat', // Prevents tiling of the background
      minHeight: '100vh', // Ensures the background covers the viewport
    }}>
      {mentors.map((mentor) => (
        <StyledCard key={mentor.id}>
          <AvailabilityBadge>
            <BoltIcon fontSize="small" style={{ marginRight: 4 }} /> {mentor.availability}
          </AvailabilityBadge>
          <TrophyBadge>🏆</TrophyBadge>
          <Avatar
            alt={mentor.name}
            src={mentor.profileImage}
            sx={{
              width: 80,
              height: 80,
              margin: "16px auto",
              border: "2px solid white",
            }}
          />
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              {mentor.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StarIcon fontSize="small" sx={{ color: "gold", mr: 0.5 }} /> {mentor.rating}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginY: 1 }}
            >
              {mentor.description}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              href={mentor.profileLink}
              sx={{
                mt: 1,
                borderRadius: "16px",
              }}
            >
              View Profile
            </Button>
          </CardContent>
        </StyledCard>
      ))}
    </Box>
    </>
    
  );
}
