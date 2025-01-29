import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import axios from "axios";

const ChatBot = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (endpoint) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/${endpoint}`);
      const textResponse = res.data
      .map((item, index) => `${index + 1}. ${item.title || item.name}`)
      .join("\n");
      setResponse(textResponse || "No results found");
    } catch (error) {
      setResponse("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = () => {
    if (query.toLowerCase().includes("hackathon")) {
      fetchData("hackathons");
    } else if (query.toLowerCase().includes("mentor")) {
      fetchData("mentors");
    } else if (query.toLowerCase().includes("blog")) {
      fetchData("blogs");
    } else if (query.toLowerCase().includes("internship")) {
      fetchData("internships");
    } else {
      setResponse("Sorry, I can only fetch hackathons, mentors, blogs, and internships.");
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", padding: 2, mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ChatBot
        </Typography>
        <TextField
          fullWidth
          label="Ask me about hackathons, mentors, blogs, or internships"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleQuery()}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleQuery}>
          Ask
        </Button>
        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : (
          <Typography variant="body1" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
            {response}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatBot;
