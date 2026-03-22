import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Search, Filter, Clock, MapPin, ChevronDown, Info, Luggage, ShieldCheck, Zap, Check, ArrowRight, Eye } from 'lucide-react';
import { toast } from 'sonner';

const Flights = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ from: '', to: '', date: '', class: 'Economy' });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/flights/search?from=${search.from}&to=${search.to}&date=${search.date}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStop = (stop: string) => {
    setSelectedStops(prev => 
      prev.includes(stop) ? prev.filter(s => s !== stop) : [...prev, stop]
    );
  };

  const toggleAirline = (airline: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    );
  };

  const filteredResults = results.filter(flight => {
    const stopMatch = selectedStops.length === 0 || (
      (selectedStops.includes('Non-stop') && flight.stops === 0) ||
      (selectedStops.includes('1 Stop') && flight.stops === 1) ||
      (selectedStops.includes('2+ Stops') && flight.stops >= 2)
    );
    const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
    return stopMatch && airlineMatch;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return 1; // Mock duration sort
    return 0;
  });

  const availableAirlines = Array.from(new Set(results.map(f => f.airline))) as string[];

  const handleAddToWatchlist = (flight: any) => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const isAlreadyTracked = watchlist.some((item: any) => item.id === flight.id);

    if (isAlreadyTracked) {
      toast.info(`${flight.airline} flight is already in your watchlist!`);
      return;
    }

    const newTrackedFlight = {
      id: flight.id,
      airline: flight.airline,
      from: flight.from,
      to: flight.to,
      price: flight.price,
      duration: flight.duration || '2h 30m',
      date: search.date || new Date().toISOString().split('T')[0],
      status: 'tracking',
      originalPrice: flight.price,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('watchlist', JSON.stringify([...watchlist, newTrackedFlight]));
    toast.success(`${flight.airline} flight added to watchlist!`, {
      description: `We'll track prices for ${flight.from} to ${flight.to}`,
      action: {
        label: 'View Watchlist',
        onClick: () => navigate('/watchlist')
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Fly <span className="text-indigo-600">Smart.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg">Compare thousands of routes and find the perfect flight for your next adventure.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
          {['Economy', 'Business', 'First'].map((cls) => (
            <button 
              key={cls}
              onClick={() => setSearch({ ...search, class: cls })}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${search.class === cls ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-indigo-100/20 border border-gray-50 mb-12">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-2">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Departure City</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <input 
                type="text" 
                placeholder="Where from?" 
                className="bg-transparent outline-none text-sm font-semibold w-full"
                value={search.from}
                onChange={(e) => setSearch({ ...search, from: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-4 space-y-2">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Arrival City</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <input 
                type="text" 
                placeholder="Where to?" 
                className="bg-transparent outline-none text-sm font-semibold w-full"
                value={search.to}
                onChange={(e) => setSearch({ ...search, to: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Travel Date</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Clock className="w-5 h-5 text-indigo-400" />
              <input 
                type="date" 
                className="bg-transparent outline-none text-sm font-semibold w-full"
                value={search.date}
                onChange={(e) => setSearch({ ...search, date: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-1 flex items-end">
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white h-[52px] rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg shadow-indigo-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Stops</p>
                {['Non-stop', '1 Stop', '2+ Stops'].map((stop) => (
                  <label 
                    key={stop} 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => toggleStop(stop)}
                  >
                    <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${
                      selectedStops.includes(stop) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 group-hover:border-indigo-600'
                    }`}>
                      {selectedStops.includes(stop) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      selectedStops.includes(stop) ? 'text-indigo-600' : 'text-gray-600'
                    }`}>{stop}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Airlines</p>
                {(availableAirlines.length > 0 ? availableAirlines : ['SkyHigh Air', 'Global Wings', 'Oceanic Jet']).map((airline) => (
                  <label 
                    key={airline} 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => toggleAirline(airline)}
                  >
                    <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${
                      selectedAirlines.includes(airline) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 group-hover:border-indigo-600'
                    }`}>
                      {selectedAirlines.includes(airline) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      selectedAirlines.includes(airline) ? 'text-indigo-600' : 'text-gray-600'
                    }`}>{airline}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results List */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-500">Showing <span className="text-gray-900 font-bold">{sortedResults.length}</span> flights</p>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400 uppercase">Sort by:</span>
              <select 
                className="bg-white border-none text-sm font-bold text-indigo-600 outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price">Cheapest Price</option>
                <option value="duration">Fastest Duration</option>
              </select>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Searching best routes...</p>
              </div>
            ) : sortedResults.length > 0 ? (
              sortedResults.map((flight, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={flight.id}
                  className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-100/30 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                      <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <Plane className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">{flight.airline}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">On Time</span>
                          <span className="text-xs text-gray-400 font-bold">Flight {flight.id}04</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-between w-full max-w-xl">
                      <div className="text-center">
                        <p className="text-2xl font-black text-gray-900">{flight.departure}</p>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">{flight.from}</p>
                      </div>
                      
                      <div className="flex-1 px-8 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 w-full">
                          <div className="w-2 h-2 rounded-full bg-gray-200" />
                          <div className="flex-1 h-[2px] bg-gradient-to-r from-gray-100 via-indigo-200 to-gray-100 relative">
                            <motion.div 
                              animate={{ left: ['0%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center border border-indigo-100"
                            >
                              <Plane className="w-2 h-2 text-indigo-600 rotate-90" />
                            </motion.div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-gray-200" />
                        </div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                          {flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stopover`}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                          <span className="flex items-center gap-1"><Luggage className="w-3 h-3" /> 23kg</span>
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> WiFi</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-black text-gray-900">{flight.arrival}</p>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">{flight.to}</p>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center w-full lg:w-auto gap-4 lg:pl-8 lg:border-l lg:border-gray-100">
                      <div className="text-left lg:text-right">
                        <p className="text-3xl font-black text-gray-900">₹{flight.price.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Per Traveler</p>
                      </div>
                      <button 
                        onClick={() => handleAddToWatchlist(flight)}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                      >
                        Add to Watchlist <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to take off?</h3>
                <p className="text-gray-400 max-w-xs mx-auto">Enter your destination and dates to find the best flight deals available today.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Flights;

