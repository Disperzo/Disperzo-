import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Play, Star } from 'lucide-react';
import StatsSection from '../components/StatsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FeaturesSection from '../components/FeaturesSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="absolute top-40 left-40 w-1 h-1 bg-blue-300 rounded-full"></div>
          <div className="absolute top-60 left-60 w-2 h-2 bg-blue-100 rounded-full"></div>
          <div className="absolute top-80 left-80 w-1 h-1 bg-blue-200 rounded-full"></div>
          <div className="absolute top-20 right-20 w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-blue-300 rounded-full"></div>
          <div className="absolute top-60 right-60 w-2 h-2 bg-blue-100 rounded-full"></div>
          <div className="absolute top-80 right-80 w-1 h-1 bg-blue-200 rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-2 sm:px-3 lg:px-4 pt-16 pb-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-5">
              <Star className="w-3 h-3 mr-1" />
              Trusted by 1000+ projects worldwide
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Distribute Crypto
              <span className="text-blue-600"> with Confidence</span>
              </h1>
            
            {/* Subtitle */}
            <p className="text-sm text-gray-600 mb-5 max-w-2xl mx-auto leading-relaxed">
              The most reliable platform for bulk token distributions. 
              <span className="font-semibold text-blue-600"> 99.9% success rate</span> across all major networks.
              </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8">
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
              >
                Get Started Free
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
              <button className="bg-white text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 inline-flex items-center justify-center border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm">
                <Play className="w-3 h-3 mr-1" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs">No KYC Required</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 text-blue-500 mr-1" />
                <span className="text-xs">Enterprise Security</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-3 h-3 text-yellow-500 mr-1" />
                <span className="text-xs">Instant Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-12 left-6 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-24 right-12 w-10 h-10 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-12 left-12 w-7 h-7 bg-blue-100 rounded-full opacity-40 animate-pulse"></div>
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features */}
      <FeaturesSection />

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Scale Your Distributions?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of projects using Disperzo for seamless bulk transfers across all major blockchains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                to="/distribute"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center justify-center"
            >
              Start Your First Distribution
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/analytics"
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 inline-flex items-center justify-center"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
            </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Disperzo</span>
              </div>
              <p className="text-gray-400 text-sm">
                The most reliable platform for bulk token distributions across all major blockchains.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Disperzo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;