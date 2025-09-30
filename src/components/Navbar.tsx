import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Wallet, BarChart3, Settings, User, LogOut } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '../contexts/AuthContext';
import SettingsModal from './SettingsModal';
import CopyableAddress from './CopyableAddress';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = usePrivy();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Distribute', href: '/distribute', icon: Wallet },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    // Close dropdown
    setIsProfileDropdownOpen(false);
    // Logout using Privy
    await logout();
    // Navigate to login page
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 px-2 sm:px-3 lg:px-4">
      <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between h-10">
          {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Disperzo</span>
          </Link>
            
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                  <span className="font-medium text-xs">{item.name}</span>
                    </Link>
                  );
                })}
            </div>
            
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Settings className="w-3 h-3" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <User className="w-3 h-3" />
              </button>
              
              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50" ref={profileDropdownRef}>
                  {/* User Info */}
                  <div className="px-2 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-900">
                      {user?.email?.address || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {user?.email?.address ? 'Email Account' : 'Wallet Connected'}
                    </p>
                    {user?.wallet?.address && (
                      <div className="mt-1">
                        <CopyableAddress 
                          address={user.wallet.address} 
                          className="text-xs"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-3 h-3 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
            <div className="md:hidden">
              <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-1 pt-1 pb-2 space-y-0.5 bg-white rounded-lg mt-1 border border-gray-200 shadow-lg">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="font-medium text-xs">{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center mt-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  <span className="text-xs">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;