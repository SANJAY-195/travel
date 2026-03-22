import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Calendar, DollarSign, Plus, Trash2, Save, Sparkles, Cloud, Sun, Wind, Navigation, Clock, GripVertical, PieChart as PieIcon, Share2, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const TripPlanner = () => {
  const [trip, setTrip] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    itinerary: [{ day: 1, activities: [] as any[] }],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const addDay = () => {
    setTrip(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, activities: [] }]
    }));
  };

  const removeDay = (dayIndex: number) => {
    if (trip.itinerary.length <= 1) return;
    const newItinerary = trip.itinerary.filter((_, i) => i !== dayIndex)
      .map((day, i) => ({ ...day, day: i + 1 }));
    setTrip({ ...trip, itinerary: newItinerary });
  };

  const addActivity = (dayIndex: number) => {
    const newTrip = { ...trip };
    newTrip.itinerary[dayIndex].activities.push({
      time: '09:00 AM',
      activity: 'New Activity',
      cost: 0,
      category: 'Sightseeing',
      notes: ''
    });
    setTrip(newTrip);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newTrip = { ...trip };
    newTrip.itinerary[dayIndex].activities.splice(activityIndex, 1);
    setTrip(newTrip);
  };

  const generateAIItinerary = async () => {
    if (!trip.destination) return alert('Please enter a destination first!');
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a 1-day travel itinerary for ${trip.destination}. Return ONLY a JSON array of activities with "time", "activity", "cost", "category" (one of: Food, Sightseeing, Transport, Shopping, Other), and "notes" fields.`,
        config: { responseMimeType: "application/json" }
      });
      
      const aiActivities = JSON.parse(response.text || '[]');
      const newTrip = { ...trip };
      newTrip.itinerary[0].activities = aiActivities;
      setTrip(newTrip);
    } catch (err) {
      console.error(err);
      alert('AI generation failed. Using fallback data.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTrip = async () => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trip),
      });
      if (res.ok) alert('Trip saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const shareTrip = () => {
    const shareText = `Check out my trip to ${trip.destination}! Total budget: ₹${trip.budget.toLocaleString()}.`;
    if (navigator.share) {
      navigator.share({
        title: `Trip to ${trip.destination}`,
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      alert(`Sharing not supported. Copy this: ${shareText}`);
    }
  };

  const clearTrip = () => {
    if (window.confirm('Are you sure you want to clear the entire itinerary?')) {
      setTrip({
        destination: '',
        startDate: '',
        endDate: '',
        budget: 0,
        itinerary: [{ day: 1, activities: [] as any[] }],
      });
    }
  };

  const totalEstimatedCost = trip.itinerary.reduce((acc, day) => {
    return acc + day.activities.reduce((dAcc, act) => dAcc + (Number(act.cost) || 0), 0);
  }, 0);

  const budgetData = [
    { name: 'Food', value: trip.itinerary.reduce((acc, day) => acc + day.activities.filter(a => a.category === 'Food').reduce((s, a) => s + (Number(a.cost) || 0), 0), 0), color: '#ef4444' },
    { name: 'Sightseeing', value: trip.itinerary.reduce((acc, day) => acc + day.activities.filter(a => a.category === 'Sightseeing').reduce((s, a) => s + (Number(a.cost) || 0), 0), 0), color: '#4f46e5' },
    { name: 'Transport', value: trip.itinerary.reduce((acc, day) => acc + day.activities.filter(a => a.category === 'Transport').reduce((s, a) => s + (Number(a.cost) || 0), 0), 0), color: '#10b981' },
    { name: 'Shopping', value: trip.itinerary.reduce((acc, day) => acc + day.activities.filter(a => a.category === 'Shopping').reduce((s, a) => s + (Number(a.cost) || 0), 0), 0), color: '#f59e0b' },
    { name: 'Other', value: trip.itinerary.reduce((acc, day) => acc + day.activities.filter(a => a.category === 'Other').reduce((s, a) => s + (Number(a.cost) || 0), 0), 0), color: '#6366f1' },
  ].filter(d => d.value > 0);

  // Fallback if no data
  const displayBudgetData = budgetData.length > 0 ? budgetData : [{ name: 'Empty', value: 1, color: '#f3f4f6' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-gray-900 tracking-tight"
          >
            Plan Your <span className="text-indigo-600">Escape.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg mt-2 font-medium">Craft a detailed journey, manage your budget, and get AI-powered suggestions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={clearTrip}
            className="bg-white text-gray-400 border-2 border-gray-100 px-4 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-50 transition-all"
            title="Clear Trip"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={shareTrip}
            className="bg-white text-indigo-600 border-2 border-indigo-100 px-4 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-50 transition-all"
            title="Share Trip"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={generateAIItinerary}
            disabled={isGenerating}
            className="bg-white text-indigo-600 border-2 border-indigo-100 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} /> 
            {isGenerating ? 'Generating...' : 'AI Suggest'}
          </button>
          <button 
            onClick={saveTrip}
            className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
          >
            <Save className="w-5 h-5" /> Save Trip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Config & Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Trip Basics Card */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-600" /> Trip Basics
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Destination</label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <Map className="w-5 h-5 text-indigo-400" />
                  <input 
                    type="text" 
                    placeholder="Where to?" 
                    className="bg-transparent outline-none text-sm font-bold w-full"
                    value={trip.destination}
                    onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Start Date</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <input 
                      type="date" 
                      className="bg-transparent outline-none text-[10px] font-bold w-full"
                      value={trip.startDate}
                      onChange={(e) => setTrip({ ...trip, startDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">End Date</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <input 
                      type="date" 
                      className="bg-transparent outline-none text-[10px] font-bold w-full"
                      value={trip.endDate}
                      onChange={(e) => setTrip({ ...trip, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Total Budget</label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                  <span className="text-indigo-400 font-black">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-transparent outline-none text-sm font-bold w-full"
                    value={trip.budget}
                    onChange={(e) => setTrip({ ...trip, budget: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weather Widget Mock */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight">Weather Info</h3>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">{trip.destination || 'Destination'}</p>
              </div>
              <Sun className="w-10 h-10 text-yellow-300" />
            </div>
            <div className="flex items-end gap-4 mb-8">
              <span className="text-6xl font-black">24°</span>
              <div className="pb-2">
                <p className="text-sm font-bold">Sunny</p>
                <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Feels like 26°</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <Cloud className="w-4 h-4 mx-auto mb-2 opacity-60" />
                <p className="text-[10px] font-black uppercase">12%</p>
                <p className="text-[8px] opacity-60 font-bold">Rain</p>
              </div>
              <div className="text-center">
                <Wind className="w-4 h-4 mx-auto mb-2 opacity-60" />
                <p className="text-[10px] font-black uppercase">8km/h</p>
                <p className="text-[8px] opacity-60 font-bold">Wind</p>
              </div>
              <div className="text-center">
                <Sun className="w-4 h-4 mx-auto mb-2 opacity-60" />
                <p className="text-[10px] font-black uppercase">High</p>
                <p className="text-[8px] opacity-60 font-bold">UV Index</p>
              </div>
            </div>
          </div>

          {/* Budget Breakdown Chart */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-600" /> Budget Breakdown
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayBudgetData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {displayBudgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {displayBudgetData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Status Card */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" /> Budget Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Estimated</p>
                  <p className="text-2xl font-black text-gray-900">₹{totalEstimatedCost.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</p>
                  <p className="text-lg font-bold text-gray-600">₹{trip.budget.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${totalEstimatedCost > trip.budget ? 'bg-red-500' : 'bg-indigo-600'}`}
                  style={{ width: `${Math.min((totalEstimatedCost / (trip.budget || 1)) * 100, 100)}%` }}
                />
              </div>
              
              {totalEstimatedCost > trip.budget && trip.budget > 0 && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
                  Over budget by ₹{(totalEstimatedCost - trip.budget).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Itinerary */}
        <div className="lg:col-span-8 space-y-8">
          {trip.itinerary.map((day, dIdx) => (
            <motion.div 
              key={dIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100px] -z-0" />
              
              <div className="relative z-10 flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Day {day.day}</h3>
                    <p className="text-indigo-600 text-xs font-bold uppercase tracking-[0.2em] mt-1">Adventure Awaits</p>
                  </div>
                  {trip.itinerary.length > 1 && (
                    <button 
                      onClick={() => removeDay(dIdx)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => addActivity(dIdx)}
                  className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Activity
                </button>
              </div>

              <div className="space-y-6 relative">
                <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-gray-100" />
                
                <AnimatePresence mode="popLayout">
                  {day.activities.length > 0 ? (
                    day.activities.map((activity: any, aIdx: number) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={aIdx} 
                        className="flex items-start gap-6 relative group"
                      >
                        <div className="relative z-10 w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-600 transition-colors">
                          <Clock className="w-5 h-5 text-indigo-600" />
                        </div>
                        
                        <div className="flex-1 bg-gray-50 p-6 rounded-3xl group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-100/30 transition-all border border-transparent group-hover:border-gray-100">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-wrap items-center gap-4">
                                <input 
                                  type="text" 
                                  className="bg-transparent text-lg font-black text-gray-900 outline-none flex-1 min-w-[200px] placeholder:text-gray-300"
                                  placeholder="Activity name..."
                                  value={activity.activity}
                                  onChange={(e) => {
                                    const newTrip = { ...trip };
                                    newTrip.itinerary[dIdx].activities[aIdx].activity = e.target.value;
                                    setTrip(newTrip);
                                  }}
                                />
                                <div className="flex items-center gap-2">
                                  <select
                                    className="bg-white px-3 py-1.5 rounded-xl border border-gray-100 text-[10px] font-black text-gray-600 outline-none"
                                    value={activity.category}
                                    onChange={(e) => {
                                      const newTrip = { ...trip };
                                      newTrip.itinerary[dIdx].activities[aIdx].category = e.target.value;
                                      setTrip(newTrip);
                                    }}
                                  >
                                    <option value="Food">Food</option>
                                    <option value="Sightseeing">Sightseeing</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Other">Other</option>
                                  </select>
                                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <input 
                                      type="text" 
                                      className="bg-transparent text-[10px] font-black text-gray-600 outline-none w-16"
                                      value={activity.time}
                                      onChange={(e) => {
                                        const newTrip = { ...trip };
                                        newTrip.itinerary[dIdx].activities[aIdx].time = e.target.value;
                                        setTrip(newTrip);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <textarea 
                                placeholder="Add some notes or details..." 
                                className="bg-transparent text-sm text-gray-500 outline-none w-full resize-none h-12 font-medium"
                                value={activity.notes}
                                onChange={(e) => {
                                  const newTrip = { ...trip };
                                  newTrip.itinerary[dIdx].activities[aIdx].notes = e.target.value;
                                  setTrip(newTrip);
                                }}
                              />
                            </div>
                            
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:pl-6 md:border-l md:border-gray-200/50">
                              <div className="text-left md:text-right">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-400 font-bold">₹</span>
                                  <input 
                                    type="number" 
                                    className="bg-transparent text-xl font-black text-gray-900 outline-none w-20 text-right"
                                    value={activity.cost}
                                    onChange={(e) => {
                                      const newTrip = { ...trip };
                                      newTrip.itinerary[dIdx].activities[aIdx].cost = Number(e.target.value);
                                      setTrip(newTrip);
                                    }}
                                  />
                                </div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Estimated Cost</p>
                              </div>
                              <button 
                                onClick={() => removeActivity(dIdx, aIdx)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <GripVertical className="w-6 h-6 text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-bold text-sm">Your itinerary is empty. Start adding activities!</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}

          <button 
            onClick={addDay}
            className="w-full py-6 rounded-[32px] border-2 border-dashed border-gray-200 text-gray-400 font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Another Day
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;

