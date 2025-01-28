import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import ProtectedRoute from "./ProtectedRoute";
import NoSignIn from "./NoSignIn";
import Homepage from "./HomePage";
import Mentors from "./Mentors";
import Blogs from "./Blogs";
import Internships from "./Internships";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    // Check if the user is logged in by checking localStorage or sessionStorage
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
    setIsLoading(false); // Loading complete
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading screen while checking login status
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hackathons"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Blogs/>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/mentors"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Mentors/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Internships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signin"
            element={<SignIn setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/explore" element={<NoSignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
