// import logo from './logo.svg';
import './App.css';

// App.js - Main application component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { auth } from './services/firebase';
import { authService } from './services/auth';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Sessions from './components/Sessions';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import LoadingSpinner from './components/LoadingSpinner';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Volleyball blue
    },
    secondary: {
      main: '#ff9800', // Orange accent
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profile = await authService.getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          {user && <Navbar user={user} userProfile={userProfile} />}
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} userProfile={userProfile} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/sessions" 
              element={user ? <Sessions user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} userProfile={userProfile} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user && userProfile?.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Default redirect */}
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
