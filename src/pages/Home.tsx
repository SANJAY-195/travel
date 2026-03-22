import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, Calendar, Users, ArrowRight, Sparkles, 
  ShieldCheck, Globe, Zap, Heart, Star, Quote, Mail, 
  Dices, Compass, Plane, Hotel, Map, X, Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { VIBES, COLLECTION } from '../constants';

const Home = () => {
  const navigate = useNavigate();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [suggestedPlaces, setSuggestedPlaces] = useState<any[]>([]);

  useEffect(() => {
    // Simulate personalized suggestions based on "past searches"
    const shuffled = [...COLLECTION].sort(() => 0.5 - Math.random());
    setSuggestedPlaces(shuffled.slice(0, 6));
  }, []);

  const PlaceDetailModal = ({ place, onClose }: { place: any, onClose: () => void }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden">
          <div className="relative h-[300px] lg:h-full">
            <img 
              src={place.img} 
              alt={place.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
          </div>
          
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{place.tag || 'Featured Destination'}</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">
              {place.name.toUpperCase()}
            </h2>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-black text-sm text-gray-900">{place.rating || '4.9'}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{place.reviews || '1.2k'} Reviews</span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 text-gray-500 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                {place.country}
              </div>
            </div>

            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-8">
              {place.desc || 'Experience the unparalleled beauty and rich history of this world-class destination. Perfectly curated for travelers seeking the extraordinary.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting From</p>
                <p className="text-xl font-black text-indigo-600">{place.price || '₹45,000'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Best Time</p>
                <p className="text-xl font-black text-gray-900">All Year</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setSelectedPlace(null);
                  navigate('/places');
                }}
                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
              >
                Explore Destination
              </button>
              <button className="w-16 h-16 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative overflow-hidden bg-[#fbfbfb]">
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDetailModal 
            place={selectedPlace} 
            onClose={() => setSelectedPlace(null)} 
          />
        )}
      </AnimatePresence>
      {/* Atmospheric Background - Recipe 7 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Split Hero Section */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 lg:px-20 py-32 lg:py-0 bg-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6"
          >
            <Compass className="w-4 h-4" />
            <span>Your Journey, Reimagined</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-8"
          >
            TRAVEL <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">BEYOND.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 mb-12 max-w-lg font-medium leading-relaxed"
          >
            Experience the world like never before. From hidden gems to iconic landmarks, we curate the extraordinary.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 relative"
          >
            <Link to="/flights" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200">
              TRACK FLIGHTS <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="mt-20 flex items-center gap-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-100">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">50k+ Happy Travelers</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-[10px] font-bold text-gray-400 ml-2">4.9/5 RATING</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[60vh] lg:h-auto overflow-hidden">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1506929113675-b9299d39cbb8?auto=format&fit=crop&w=1920&q=80" 
            alt="Travel Hero"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply" />
          
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-20 right-20 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 hidden lg:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Flight</p>
                <p className="text-sm font-black text-gray-900">Paris, France</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 left-20 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 hidden lg:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Hotel className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Hotel</p>
                <p className="text-sm font-black text-gray-900">The Ritz London</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats - Recipe 8 Style */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { label: 'Active Trips', value: '12.4k', trend: '+14%' },
              { label: 'Destinations', value: '1.2k', trend: '+5%' },
              { label: 'Verified Reviews', value: '85k', trend: '+22%' },
              { label: 'Support Speed', value: '2m', trend: '-10%' },
            ].map((stat, i) => (
              <div key={i} className="space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-5xl font-black tracking-tighter">{stat.value}</h3>
                  <span className={`text-xs font-bold mb-2 ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="dot-chart grid grid-cols-10 gap-1 opacity-20">
                  {Array.from({ length: 20 }).map((_, j) => (
                    <div key={j} className={`w-1 h-1 rounded-full ${j < 12 ? 'bg-white' : 'bg-gray-700'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel by Vibe - Interactive Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-6xl font-black text-gray-900 tracking-tighter">FIND YOUR <br /> <span className="text-indigo-600">VIBE.</span></h2>
              <p className="text-gray-500 text-lg mt-6 font-medium">Not sure where to go? Choose a mood and let us handle the rest.</p>
            </div>
            {selectedVibe && (
              <button 
                onClick={() => setSelectedVibe(null)}
                className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
              >
                <ArrowRight className="w-5 h-5 rotate-180" /> Back to Vibes
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!selectedVibe ? (
              <motion.div 
                key="vibe-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {VIBES.map((vibe, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className="relative h-[400px] rounded-[32px] overflow-hidden group cursor-pointer"
                  >
                    <img 
                      src={vibe.img} 
                      alt={vibe.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className={`w-16 h-16 ${vibe.color} rounded-full flex items-center justify-center mb-4 scale-0 group-hover:scale-100 transition-transform duration-500`}>
                        <vibe.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-widest">{vibe.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="vibe-recommendations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {VIBES.find(v => v.id === selectedVibe)?.places.map((place, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedPlace(place)}
                    className="group bg-gray-50 rounded-[32px] overflow-hidden cursor-pointer hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-indigo-50"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={place.img} 
                        alt={place.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                          <Info className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-indigo-600 font-black text-[8px] uppercase tracking-[0.2em] mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{place.country}</span>
                      </div>
                      <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{place.name}</h4>
                      <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
                        {place.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">THE <br /> COLLECTION.</h2>
              <p className="text-gray-500 text-lg mt-6 font-medium">Suggested for you based on your recent searches.</p>
            </div>
            <Link to="/trips" className="group flex items-center gap-4 text-gray-900 font-black text-sm uppercase tracking-widest">
              Explore All <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all"><ArrowRight className="w-5 h-5" /></div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedPlaces.map((dest, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedPlace(dest)}
                className="group relative h-[600px] rounded-[40px] overflow-hidden cursor-pointer"
              >
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-8 right-8">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">{dest.tag}</span>
                  <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{dest.name}</h3>
                  <div className="flex justify-between items-end">
                    <p className="text-white/60 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {dest.country}
                    </p>
                    <div className="flex items-center gap-1 text-white">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold">{dest.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Traveler Stories - Recipe 7 Style */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">TRAVELER STORIES.</h2>
            <p className="text-gray-500 mt-6 font-medium">Real experiences from our global community of explorers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'Adventure Blogger', text: 'The AI itinerary planner saved me hours of research. It found hidden spots in Bali I would have never discovered on my own.', img: 'https://i.pravatar.cc/150?u=sarah' },
              { name: 'Marcus Chen', role: 'Digital Nomad', text: 'Seamless booking experience. The multi-city flight tool is a game changer for my lifestyle. Highly recommended!', img: 'https://i.pravatar.cc/150?u=marcus' },
              { name: 'Elena Rodriguez', role: 'Luxury Traveler', text: 'The hotel selection is top-notch. Every recommendation felt curated specifically for my taste and preferences.', img: 'https://i.pravatar.cc/150?u=elena' },
            ].map((story, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between">
                <div>
                  <Quote className="w-10 h-10 text-indigo-100 mb-8" />
                  <p className="text-gray-600 text-lg font-medium leading-relaxed italic">"{story.text}"</p>
                </div>
                <div className="mt-12 flex items-center gap-4">
                  <img src={story.img} alt={story.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">{story.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Bold CTA */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-[60px] p-12 lg:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/20 skew-x-12 translate-x-1/4" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-8">
                JOIN THE <br /> <span className="text-indigo-400">INNER CIRCLE.</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium max-w-md">
                Get exclusive travel deals, early access to new destinations, and expert tips delivered to your inbox.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-white/10 border border-white/20 rounded-3xl py-6 pl-16 pr-6 text-white outline-none focus:border-indigo-400 transition-all font-medium"
                />
              </div>
              <button className="w-full bg-white text-gray-900 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all">
                SUBSCRIBE NOW
              </button>
              <p className="text-[10px] text-gray-500 text-center font-bold uppercase tracking-widest">
                No spam. Only inspiration. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Micro-details */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900 tracking-tighter">TRAVEL APP.</span>
          </div>
          
          <div className="flex gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
          </div>

          <div className="flex gap-4">
            {['TW', 'IG', 'FB', 'LI'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;


