import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulated API call to Flask backend
  const fetchMessage = async () => {
    // In a real app, this would be: const response = await fetch('http://localhost:5000/api/message');
    // Simulating backend response
    setTimeout(() => {
      setMessage('Connected to Flask backend! 🚀');
    }, 500);
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-2xl font-bold text-white">NexaFlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition transform hover:scale-105">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white transition">Features</a>
              <a href="#about" className="block px-3 py-2 text-gray-300 hover:text-white transition">About</a>
              <a href="#contact" className="block px-3 py-2 text-gray-300 hover:text-white transition">Contact</a>
              <button className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg mt-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Build Something
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Extraordinary
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your ideas into reality with our powerful React and Flask integration. Fast, secure, and beautiful.
            </p>
            {message && (
              <div className="inline-block bg-green-500/20 text-green-300 px-4 py-2 rounded-lg mb-6">
                {message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 flex items-center justify-center group">
                Start Free Trial
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
              </button>
              <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition transform hover:scale-105">
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400">Built with performance in mind. Experience blazing fast load times and smooth interactions.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition transform hover:scale-105">
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Secure by Default</h3>
              <p className="text-gray-400">Enterprise-grade security built into every layer. Your data is safe with us.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition transform hover:scale-105">
              <Sparkles className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Beautiful Design</h3>
              <p className="text-gray-400">Stunning interfaces that users love. Modern design that makes an impact.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of satisfied users today.</p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg shadow-purple-500/50">
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 NexaFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
