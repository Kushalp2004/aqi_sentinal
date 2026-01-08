import React, { useEffect } from 'react';
import { MapPin, CheckCircle } from 'lucide-react';

const LocationChangeNotification = ({ stationName, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
      <div className="bg-slate-800/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-700/50">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
        <div>
          <div className="font-semibold text-sm">Location Changed</div>
          <div className="text-xs flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5" />
            <span>{stationName}</span>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translate(-50%, -100px);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, 10px);
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default LocationChangeNotification;
