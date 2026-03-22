import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Hotel, Search, Star, MapPin, Wifi, Coffee, Dumbbell, Map as MapIcon, Grid, ChevronRight, Heart, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

const Hotels = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  
  // New Filters
  const [filters, setFilters] = useState({
    amenities: [] as string[],
    starRating: null as number | null,
    propertyType: 'All'
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels/search?city=${city}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) 
        ? prev.amenities.filter(a => a !== amenity) 
        : [...prev.amenities, amenity]
    }));
  };

  const filteredResults = results.filter(hotel => {
    const amenityMatch = filters.amenities.length === 0 || 
      filters.amenities.every(a => hotel.amenities.includes(a));
    const ratingMatch = !filters.starRating || hotel.rating >= filters.starRating;
    const typeMatch = filters.propertyType === 'All' || hotel.type === filters.propertyType;
    return amenityMatch && ratingMatch && typeMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Stay <span className="text-indigo-600">Inspired.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg">From boutique hideaways to luxury resorts, find a stay that matches your vibe.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Grid className="w-4 h-4" /> Grid
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MapIcon className="w-4 h-4" /> Map
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-indigo-100/20 border border-gray-50 mb-12">
        <form onSubmit={handleSearch} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Destination City</label>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <input 
                  type="text" 
                  placeholder="Where are you going?" 
                  className="bg-transparent outline-none text-sm font-semibold w-full"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full md:w-auto bg-indigo-600 text-white px-12 h-[52px] rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Search className="w-5 h-5" /> Search Stays
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-gray-50">
            {/* Amenities */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {['Pool', 'Gym', 'WiFi', 'Spa', 'Parking'].map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filters.amenities.includes(amenity) 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Star Rating</p>
              <div className="flex gap-2">
                {[3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, starRating: prev.starRating === star ? null : star }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${
                      filters.starRating === star 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'
                    }`}
                  >
                    {star} <Star className={`w-3 h-3 ${filters.starRating === star ? 'fill-white' : 'fill-gray-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Type</p>
              <select 
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="All">All Types</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
                <option value="Apartment">Apartment</option>
                <option value="Boutique">Boutique</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Finding best properties...</p>
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((hotel, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={hotel.id}
                  className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-2xl hover:shadow-indigo-100/40 transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                      <button className="bg-white/90 backdrop-blur p-2 rounded-xl shadow-sm hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black text-gray-900">{hotel.rating}</span>
                      <span className="text-[10px] text-gray-400 font-bold">/ 5.0</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">{hotel.name}</h3>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                          <MapPin className="w-3 h-3 text-indigo-400" /> {hotel.city}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {hotel.amenities.map((amenity: string) => (
                        <span key={amenity} className="bg-gray-50 text-gray-500 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-gray-100">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div>
                        <p className="text-3xl font-black text-gray-900">₹{hotel.price.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Avg. Per Night</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/book/hotel/${hotel.id}`, { state: { item: hotel } })}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                      >
                        Reserve <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Hotel className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Where to next?</h3>
                <p className="text-gray-400 max-w-xs mx-auto">Discover unique stays from our curated collection of properties worldwide.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative h-[600px] rounded-[40px] overflow-hidden border border-gray-100 shadow-xl"
          >
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80" 
                alt="Map Mock" 
                className="w-full h-full object-cover opacity-50 grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-indigo-900/10" />
              <div className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl max-w-sm border border-white/20">
                <MapIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map View</h3>
                <p className="text-gray-500 text-sm mb-6">Explore properties by location. Connect your Google Maps API key to enable live mapping.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {results.slice(0, 5).map((h, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden">
                      <img src={h.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hotels;

