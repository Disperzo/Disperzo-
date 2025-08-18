import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import DistributionWizard from './pages/DistributionWizard';
import { ChainProvider } from './contexts/ChainContext';
import './App.css';

function App() {
  return (
    <ChainProvider>
    <Router>
        <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={
            <>
              <Navbar />
              <LandingPage />
            </>
          } />
          <Route path="/dashboard" element={
            <>
              <Navbar />
              <Dashboard />
            </>
          } />
          <Route path="/analytics" element={
            <>
              <Navbar />
              <Analytics />
            </>
          } />
          <Route path="/distribute" element={
            <>
              <Navbar />
              <DistributionWizard />
            </>
          } />
        </Routes>
      </div>
    </Router>
    </ChainProvider>
  );
}

export default App;