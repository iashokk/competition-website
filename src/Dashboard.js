import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { Grid, Typography, Card, CardContent } from "@mui/material";

const cardData = [
  { title: "Internships", description: "Gain Practical Experience", color: "#B5EAEA", route: "/internships" },
  { title: "Mentorships", description: "Guidance From Top Mentors", color: "#FFBCBC", route: "/mentors" },
  { title: "Jobs", description: "Explore Diverse Careers", color: "#A0D2EB", route: "/jobs" },
  { title: "Practice", description: "Refine Skills Daily", color: "#D4A5A5", route: "/practice" },
  { title: "Competitions", description: "Battle For Excellence", color: "#FFF1C1", route: "/competitions" },
  { title: "More", description: "Explore More Opportunities", color: "#E2C2B9", route: "/more" },
];

const cardStyles = {
  card: {
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    height: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer", // Make it look clickable
  },
  cardContent: {
    textAlign: "center",
    color: "#333",
  },
};

const backgroundWrapperStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'white',
  backgroundSize: 'cover',
  backgroundImage: 'url(/Background.png)',
};

function Dashboard() {
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <>
      <NavBar />
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <div style={backgroundWrapperStyles}></div> {/* Background */}

        <Grid container spacing={3} style={{ position: "relative", zIndex: 1, marginTop: "50px" }}>
          <Grid item xs={12} style={{ marginBottom: "30px" }}>
            <Typography variant="h4" align="center" style={{ fontWeight: "bold" }}>
              Unlock Your Career
            </Typography>
            <Typography variant="body1" align="center" style={{ marginTop: "10px", color: "#555" }}>
              Explore opportunities from across the globe to grow, showcase skills, gain CV points & get hired by your dream company.
            </Typography>
          </Grid>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                style={{ ...cardStyles.card, backgroundColor: card.color }}
                onClick={() => handleCardClick(card.route)}
              >
                <CardContent style={cardStyles.cardContent}>
                  <Typography variant="h5" style={{ fontWeight: "bold" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" style={{ marginTop: "5px" }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}

export default Dashboard;