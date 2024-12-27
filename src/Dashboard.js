import React from "react";
import NavBar from "./NavBar";
import { Grid, Typography, Card, CardContent } from "@mui/material";

const cardStyles = {
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    boxShadow: "0 4px 8px #7B9DC8",
  },
  cardContent: {
    textAlign: "center",
  },
};

const backgroundWrapperStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: "url('/background.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: 0.4,
  zIndex: -1, // Ensures the background stays behind all other content
};

function Dashboard() {
  return (
    <>
      <NavBar />
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <div style={backgroundWrapperStyles}></div> {/* Background with opacity */}

        <Grid container spacing={2} style={{ position: "relative", zIndex: 1, marginTop: "100px" }}>
          <Grid item xs={6} container alignItems="center" justifyContent="center">
            <Typography variant="h4" align="center">
              Unlock the Possibility
            </Typography>
          </Grid>
          <Grid item xs={6} container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={6} key={item}>
                <Card style={cardStyles.card}>
                  <CardContent style={cardStyles.cardContent}>
                    <Typography variant="h5">Card {item}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Dashboard;
