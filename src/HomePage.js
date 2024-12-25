import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/hackathons')
      .then(response => response.json())
      .then(data => setHackathons(data))
      .catch(error => console.error('Error fetching hackathons:', error));
  }, []);

  return (
    <div>
      <h1>Hackathons</h1>
      <ul>
        {hackathons.map((hackathonData, index) => (
          <li key={index}>
            <h2>{hackathonData.title}</h2>
            <p>{hackathonData.date}</p>
            <p>{hackathonData.description}</p>
            <a href={hackathonData.link} target="_blank" rel="noreferrer">Learn more</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
