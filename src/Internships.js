import React from 'react';
import { useState, useEffect } from 'react';
import {  Typography, Box, Container } from "@mui/material";
import InternshipCard from './InternshipsCard';
import Navbar from './NavBar';
import { CircularProgress } from '@mui/material';
function Internships() {

    const [internships, setInternships] = useState([]);
      const [loading, setLoading] = useState(true);
    

  useEffect(() => {
    const fetchInternships = async () => {
      const response = await fetch("http://localhost:5000/api/internships");
      const data = await response.json();
      setInternships(data);
      setLoading(false);
    };

    fetchInternships();
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
         <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Internships
      </Typography>
      {internships.map((internship, index) => (
        <InternshipCard key={index} data={internship} />
      ))}
    </Container>
        </>
       
    );
}

export default Internships;