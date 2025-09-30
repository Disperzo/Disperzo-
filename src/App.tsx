import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import DistributionWizard from './pages/DistributionWizard';
import ProtectedRoute from './components/ProtectedRoute';
import { ChainProvider } from './contexts/ChainContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContractProvider } from './contexts/ContractContext';
import './App.css';

function App() {
  return (
    <ChainProvider>
      <AuthProvider>
        <ContractProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Navbar />
                    <LandingPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Navbar />
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Navbar />
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/distribute" element={
                  <ProtectedRoute>
                    <Navbar />
                    <DistributionWizard />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </ContractProvider>
      </AuthProvider>
    </ChainProvider>
  );
}

export default App;