import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Hotel, User, Mail, Phone, Calendar, ArrowRight, CheckCircle, Info, CreditCard } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface PassengerDetails {
  name: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
}

const BookingFlow = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [itemDetails, setItemDetails] = useState<any>(location.state?.item || null);
  const [passenger, setPassenger] = useState<PassengerDetails>({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: ''
  });
  const [bookingConfig, setBookingConfig] = useState({
    rooms: 1,
    nights: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmedReview, setShowConfirmedReview] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  useEffect(() => {
    if (!itemDetails) {
      navigate(type === 'flight' ? '/flights' : '/hotels');
    }
  }, [itemDetails, navigate, type]);

  const calculateTotal = () => {
    if (type === 'hotel') {
      return itemDetails.price * bookingConfig.rooms * bookingConfig.nights;
    }
    return itemDetails.price;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPassenger(prev => ({ ...prev, [name]: value }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingConfig(prev => {
      const newConfig = { ...prev, [name]: value };
      if (name === 'startDate' || name === 'endDate') {
        const start = new Date(newConfig.startDate);
        const end = new Date(newConfig.endDate);
        if (end > start) {
          newConfig.nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          newConfig.nights = 1;
        }
      }
      return newConfig;
    });
  };

  const validateStep2 = () => {
    if (!passenger.name || !passenger.email || !passenger.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    if (type === 'flight' && !passenger.age) {
      setError('Please enter passenger age');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(passenger.email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      // Generate reservation details
      const reservationId = `RES${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      // Save to localStorage as reserved
      const reservation = {
        reservationId,
        type: type?.toLowerCase(),
        amount: calculateTotal(),
        date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: "reserved",
        paymentStatus: "Unpaid",
        expiry: expiry.toISOString(),
        hotelDetails: type === 'hotel' ? itemDetails : null,
        flightDetails: type === 'flight' ? itemDetails : null,
        guestInfo: passenger,
        bookingConfig: bookingConfig,
        originalDetails: {
          ...itemDetails,
          passenger,
          config: bookingConfig
        },
        itemType: type === 'flight' ? 'Flight' : 'Hotel'
      };

      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([reservation, ...existingBookings]));

      if (type === 'hotel') {
        toast.success('Your hotel has been reserved successfully!');
      } else {
        toast.success('Your flight has been reserved successfully!');
      }

      // Navigate to reservation success page (ConfirmationPage)
      navigate(`/confirmation/${reservationId}`, { 
        state: { 
          reservation,
          reservationId
        } 
      });
    } catch (err: any) {
      setError('Error creating reservation');
    } finally {
      setLoading(false);
    }
  };

  if (!itemDetails) return null;

  const totalAmount = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-16">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-10" />
        <div className={`absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 -z-10 transition-all duration-500`} style={{ width: `${((step - 1) / 2) * 100}%` }} />
        
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-indigo-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
            {step > s ? <CheckCircle className="w-6 h-6" /> : s}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-12 px-2">
        <span>Details</span>
        <span>Information</span>
        <span>Review</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                {type === 'flight' ? <Plane className="w-6 h-6 text-indigo-600" /> : <Hotel className="w-6 h-6 text-indigo-600" />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{type === 'flight' ? 'Flight Selection' : 'Hotel Selection'}</h2>
                <p className="text-gray-500 font-medium">Review your choice and configure options</p>
              </div>
            </div>

            <div className="space-y-6">
              {type === 'flight' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-3xl">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Airline</p>
                      <p className="text-lg font-black text-gray-900">{itemDetails.airline}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Duration</p>
                      <p className="text-lg font-black text-gray-900">{itemDetails.duration || '2h 30m'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Departure</p>
                      <p className="text-lg font-black text-gray-900">{itemDetails.departure}</p>
                      <p className="text-sm font-bold text-gray-400">{itemDetails.from}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Arrival</p>
                      <p className="text-lg font-black text-gray-900">{itemDetails.arrival}</p>
                      <p className="text-sm font-bold text-gray-400">{itemDetails.to}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4 text-indigo-600" /> Price Breakdown
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium text-gray-500">
                        <span>Base Fare</span>
                        <span>₹{(itemDetails.price * 0.8).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-gray-500">
                        <span>Taxes & Surcharges</span>
                        <span>₹{(itemDetails.price * 0.15).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-gray-500">
                        <span>Service Fee</span>
                        <span>₹{(itemDetails.price * 0.05).toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-gray-900">
                        <span>Total Amount</span>
                        <span className="text-indigo-600">₹{itemDetails.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-3xl">
                    <div className="col-span-2">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Hotel Name</p>
                      <p className="text-lg font-black text-gray-900">{itemDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Room Type</p>
                      <p className="text-lg font-black text-gray-900">{itemDetails.roomType || 'Standard Room'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Price per Night</p>
                      <p className="text-lg font-black text-indigo-600">₹{itemDetails.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Check-in Date</label>
                      <input 
                        type="date" 
                        name="startDate"
                        value={bookingConfig.startDate}
                        onChange={handleConfigChange}
                        className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Check-out Date</label>
                      <input 
                        type="date" 
                        name="endDate"
                        value={bookingConfig.endDate}
                        onChange={handleConfigChange}
                        className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Number of Rooms</label>
                      <select 
                        name="rooms"
                        value={bookingConfig.rooms}
                        onChange={handleConfigChange}
                        className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none"
                      >
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <div className="flex items-end pb-2">
                      <p className="text-sm font-bold text-gray-500">{bookingConfig.nights} Night{bookingConfig.nights > 1 ? 's' : ''} Stay</p>
                    </div>
                  </div>

                  <div className="p-8 bg-indigo-600 rounded-[32px] text-white flex justify-between items-center">
                    <div>
                      <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Estimated Total</p>
                      <p className="text-3xl font-black">₹{totalAmount.toLocaleString()}</p>
                    </div>
                    <CreditCard className="w-12 h-12 text-indigo-400 opacity-50" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-end">
              <button 
                onClick={handleNext}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{type === 'flight' ? 'Passenger Details' : 'Guest Details'}</h2>
                <p className="text-gray-500 font-medium">Please enter the details accurately</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Full Name</label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <User className="w-5 h-5 text-indigo-400" />
                  <input 
                    type="text" 
                    name="name"
                    value={passenger.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name" 
                    className="bg-transparent outline-none text-sm font-semibold w-full"
                  />
                </div>
              </div>
              
              {type === 'flight' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Age</label>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                      <input 
                        type="number" 
                        name="age"
                        value={passenger.age}
                        onChange={handleInputChange}
                        placeholder="Age" 
                        className="bg-transparent outline-none text-sm font-semibold w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Gender</label>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      <User className="w-5 h-5 text-indigo-400" />
                      <select 
                        name="gender"
                        value={passenger.gender}
                        onChange={handleInputChange}
                        className="bg-transparent outline-none text-sm font-semibold w-full"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Email Address</label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={passenger.email}
                    onChange={handleInputChange}
                    placeholder="Email address" 
                    className="bg-transparent outline-none text-sm font-semibold w-full"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <input 
                    type="tel" 
                    name="phone"
                    value={passenger.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number" 
                    className="bg-transparent outline-none text-sm font-semibold w-full"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-between">
              <button 
                onClick={handleBack}
                className="text-gray-400 px-10 py-4 rounded-2xl font-bold hover:text-gray-600 transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100"
              >
                Review Booking <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Review Booking</h2>
                <p className="text-gray-500 font-medium">Final summary before payment</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-gray-50 rounded-3xl">
                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">{type === 'flight' ? 'Flight Information' : 'Hotel Information'}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Selection</p>
                    <p className="font-black text-gray-900">{type === 'flight' ? itemDetails.airline : itemDetails.name}</p>
                  </div>
                  {type === 'hotel' && (
                    <>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Dates</p>
                        <p className="font-black text-gray-900">{bookingConfig.startDate} to {bookingConfig.endDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Rooms</p>
                        <p className="font-black text-gray-900">{bookingConfig.rooms} Room{bookingConfig.rooms > 1 ? 's' : ''}</p>
                      </div>
                    </>
                  )}
                  {type === 'flight' && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Route</p>
                      <p className="font-black text-gray-900">{itemDetails.from} to {itemDetails.to}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Amount</p>
                    <p className="font-black text-indigo-600">₹{totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-3xl">
                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">{type === 'flight' ? 'Passenger Details' : 'Guest Details'}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase">Name</p>
                    <p className="font-black text-gray-900">{passenger.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                    <p className="font-black text-gray-900">{passenger.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                    <p className="font-black text-gray-900">{passenger.phone}</p>
                  </div>
                  {type === 'flight' && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Age / Gender</p>
                      <p className="font-black text-gray-900">{passenger.age} / {passenger.gender}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-indigo-600 rounded-[32px] text-white flex justify-between items-center">
                <div>
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Total Payable</p>
                  <p className="text-3xl font-black">₹{totalAmount.toLocaleString()}</p>
                </div>
                <CreditCard className="w-12 h-12 text-indigo-400 opacity-50" />
              </div>
            </div>

            <div className="mt-12 flex justify-between">
              <button 
                onClick={handleBack}
                className="text-gray-400 px-10 py-4 rounded-2xl font-bold hover:text-gray-600 transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleConfirmBooking}
                disabled={loading}
                className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (type === 'hotel' ? 'Reserve' : 'Confirm & Proceed')} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingFlow;
