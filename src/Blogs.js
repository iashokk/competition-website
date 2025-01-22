import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Card, CardMedia, CardContent, Typography, CardActions, Button, Grid } from '@mui/material';
import Navbar from './NavBar';

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch("http://localhost:5000/api/blogs")
          .then(response => response.json())
          .then(data => setBlogs(data))
          .then(() => setLoading(false))
          .catch(err => console.error("Error fetching blogs:", err));
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
      <Navbar />
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={4} justifyContent="center">
          {blogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ maxWidth: 345, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={blog.image}
                  title={blog.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {blog.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button href={blog.link} size="small" sx={{ textTransform: 'none' }}>Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default Blogs;
