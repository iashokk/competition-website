import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
const HomePage = () => {
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/hackathons")
      .then((response) => response.json())
      .then((data) => setHackathons(data))
      .catch((error) => console.error("Error fetching hackathons:", error));
  }, []);

  return (
    <div>
      <h1>Hackathons</h1>
      {hackathons.map((hackathonData, index) => (
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
          <Button href={hackathonData.link} target="_blank" rel="noreferrer" size="small">Learn More</Button>
        </CardActions>
      </Card>
      ))}
    </div>
  );
};

export default HomePage;
