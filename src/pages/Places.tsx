import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, Sparkles, Navigation, Info, Star, Camera, Landmark, Map as MapIcon } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useNavigate } from 'react-router-dom';

interface Attraction {
  name: string;
  description: string;
  details: string;
  photoUrl: string;
  keyPoints: string[];
}

interface PlaceDetails {
  intro: string;
  attractions: Attraction[];
}

const Places = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide an introduction and a list of at least 12 top attractions for "${location}". 
        The date of visit is ${date || 'anytime'}. 
        For each attraction, provide a name, a short description, a detailed paragraph of information, at least 10 key points (interesting facts or tips), and a relevant high-quality Unsplash image URL (e.g., https://images.unsplash.com/photo-...).
        CRITICAL: Ensure the photoUrl is an actual, accurate photo of the specific attraction mentioned. Use Google Search to verify the attraction details and find the most relevant image.
        Return the response in JSON format with "intro" (string) and "attractions" (array of objects with "name", "description", "details", "photoUrl", and "keyPoints").`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intro: { type: Type.STRING },
              attractions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    details: { type: Type.STRING },
                    photoUrl: { type: Type.STRING },
                    keyPoints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["name", "description", "details", "photoUrl", "keyPoints"]
                }
              }
            },
            required: ["intro", "attractions"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      {/* Attraction Detail Modal */}
      <AnimatePresence>
        {selectedAttraction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAttraction(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-80">
                <img 
                  src={selectedAttraction.photoUrl} 
                  alt={selectedAttraction.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedAttraction(null)}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all"
                >
                  <Search className="w-5 h-5 rotate-45" />
                </button>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">{selectedAttraction.name}</h2>
                </div>
                <p className="text-gray-500 text-lg font-medium mb-8 italic">"{selectedAttraction.description}"</p>
                <div className="prose prose-indigo max-w-none">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {selectedAttraction.details}
                  </p>
                </div>

                <div className="mt-10 pt-10 border-t border-gray-100">
                  <h4 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" /> Key Highlights & Tips
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {selectedAttraction.keyPoints.map((point, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-black text-indigo-600">{idx + 1}</span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setSelectedAttraction(null);
                      navigate(`/flights?to=${location}`);
                    }}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    Track Flights
                  </button>
                  <button className="bg-gray-50 text-gray-600 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100">
                    Save to Favorites
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Explore <span className="text-indigo-600">Places.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg">Discover the world's most beautiful destinations and their hidden stories.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-indigo-100/20 border border-gray-50 mb-12">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Location</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <input 
                type="text" 
                placeholder="Where do you want to go?" 
                className="bg-transparent outline-none text-sm font-semibold w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-64 space-y-2">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Travel Date</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <input 
                type="date" 
                className="bg-transparent outline-none text-sm font-semibold w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-indigo-600 text-white px-12 h-[52px] rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? 'Searching...' : 'Search Places'}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {details ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Intro Section */}
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-[200px] -z-0" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <Info className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">About {location}</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  {details.intro}
                </p>
              </div>
            </div>

            {/* Attractions Grid */}
            <div>
              <div className="flex items-center gap-3 mb-8 ml-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Top Attractions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {details.attractions.map((attraction, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedAttraction(attraction)}
                    className="bg-white rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all group cursor-pointer overflow-hidden flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={attraction.photoUrl} 
                        alt={attraction.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm">
                        <Landmark className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>
                    <div className="p-8 flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">{attraction.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-3">
                        {attraction.description}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                        View Details <Navigation className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : !loading && (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapIcon className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Discover New Horizons</h3>
            <p className="text-gray-400 max-w-xs mx-auto">Enter a location to see its wonders and plan your next visit.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Places;
