import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking localStorage or sessionStorage
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="App">
     
      {/* <Dashboard /> */}
       {/* {isLoggedIn ? <HomePage /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} */}
       {/* <SignUp/> */}
       {/* <SignIn/> */}
       <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
