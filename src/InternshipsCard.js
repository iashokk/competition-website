import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const InternshipCard = ({ data }) => {
  const link = data.link; // Assuming you pass the link in the data prop

  return (
    <Card sx={{ display: "flex", alignItems: "center", mb: 2, boxShadow: 3 }}>
      <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", width: "100%", color:"black" }}>
        {/* Company Logo */}
        <CardMedia
          component="img"
          image={data.logo}
          alt={data.company}
          sx={{ width: 80, height: 80, objectFit: "contain", p: 1 }}
        />

        {/* Internship Details */}
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {data.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.company}
            {data.activelyHiring && (
              <Chip
                label="Actively hiring"
                color="success"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>

          {/* Details Row */}
          <Stack direction="row" spacing={2} mt={1}>
            <Box display="flex" alignItems="center">
              <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{data.location}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{data.duration}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{data.stipend}</Typography>
            </Box>
          </Stack>

          {/* Posted Time */}
          <Box display="flex" alignItems="center" mt={1}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {data.postedAgo}
            </Typography>
          </Box>
        </CardContent>
      </a>
    </Card>
  );
};

export default InternshipCard;
