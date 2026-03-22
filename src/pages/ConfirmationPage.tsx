import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Download, Home, ArrowRight, Plane, Hotel, Calendar, User, MapPin, CreditCard } from 'lucide-react';

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state?.reservation;
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    if (!reservation) {
      navigate('/dashboard');
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(reservation.expiry).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation, navigate]);

  if (!reservation) return null;

  const handleDownloadTicket = () => {
    alert('Reservation details download started...');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[48px] shadow-sm border border-gray-100 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-500" />
        
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-orange-600" />
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Reservation Successful!</h1>
        <p className="text-gray-500 text-lg font-medium mb-12">Your booking is on hold. Please complete payment before the expiry time.</p>

        <div className="max-w-2xl mx-auto mb-12 text-left">
          <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Reservation Details</h3>
              <div className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                Reserved
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  {reservation.itemType === 'Flight' ? <Plane className="w-5 h-5 text-indigo-600" /> : <Hotel className="w-5 h-5 text-indigo-600" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Selection</p>
                  <p className="font-black text-gray-900">{reservation.originalDetails.airline || reservation.originalDetails.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Reservation ID</p>
                  <p className="font-black text-gray-900">#{reservation.reservationId}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Passenger / Guest</p>
                  <p className="font-black text-gray-900">{reservation.originalDetails.passenger.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Expires In</p>
                  <p className="font-black text-red-600">{timeLeft}</p>
                </div>
              </div>
              {reservation.itemType === 'Hotel' && reservation.originalDetails.config && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Stay Dates</p>
                      <p className="font-black text-gray-900">{reservation.originalDetails.config.startDate} to {reservation.originalDetails.config.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                      <Hotel className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Rooms</p>
                      <p className="font-black text-gray-900">{reservation.originalDetails.config.rooms} Room{reservation.originalDetails.config.rooms > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </>
              )}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Payment Status</p>
                  <p className={`font-black ${reservation.paymentStatus === 'Unpaid' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {reservation.paymentStatus}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Total Amount</p>
                  <p className="font-black text-indigo-600">₹{reservation.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={handleDownloadTicket}
            className="w-full md:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"
          >
            <Download className="w-5 h-5" /> Download Details
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full md:w-auto bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 border border-gray-100"
          >
            <Home className="w-5 h-5" /> Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationPage;
