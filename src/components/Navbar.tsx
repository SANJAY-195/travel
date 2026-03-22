import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plane, Hotel, Map, LayoutDashboard, Globe, Compass, CreditCard, Eye } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-2xl border-b border-gray-100 py-3' 
        : isHome ? 'bg-transparent py-6' : 'bg-white py-4 border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`p-2 rounded-xl transition-all duration-500 ${
              scrolled || !isHome ? 'bg-gray-900' : 'bg-white/20 backdrop-blur-md border border-white/30'
            }`}>
              <Globe className={`w-5 h-5 transition-colors ${scrolled || !isHome ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`text-xl font-black tracking-tighter transition-colors ${
              scrolled || !isHome ? 'text-gray-900' : 'text-white'
            }`}>TRAVEL APP.</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {[
              { to: '/places', label: 'Places', icon: Compass },
              { to: '/flights', label: 'Flights', icon: Plane },
              { to: '/hotels', label: 'Hotels', icon: Hotel },
              { to: '/trips', label: 'Planner', icon: Map },
              { to: '/watchlist', label: 'Watchlist', icon: Eye },
            ].map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all hover:opacity-70 ${
                  scrolled || !isHome ? 'text-gray-500' : 'text-white/80'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" /> {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className={`text-[10px] font-black uppercase tracking-[0.2em] hidden sm:flex items-center gap-2 ${
              scrolled || !isHome ? 'text-gray-900' : 'text-white'
            }`}>
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
