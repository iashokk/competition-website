import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import HomePage from './HomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking localStorage or sessionStorage
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="App">
      {isLoggedIn ? <HomePage /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
      Hello
    </div>
  );
}

export default App;
