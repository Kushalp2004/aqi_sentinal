import React, { useEffect, useState } from 'react';
import { Wind } from 'lucide-react';

const LoadingScreen = ({ onLoadComplete }) => {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timer1 = setTimeout(() => setStage(1), 500);
        const timer2 = setTimeout(() => setStage(2), 1500);
        const timer3 = setTimeout(() => setStage(3), 2500);
        const timer4 = setTimeout(() => onLoadComplete(), 3500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [onLoadComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
            {/* Animated Wind Lines */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: '-100%',
                            width: `${Math.random() * 200 + 100}px`,
                            animation: `windBlow ${Math.random() * 3 + 2}s linear infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Center Content */}
            <div className="relative z-10 text-center">
                {/* Wind Icon */}
                <div
                    className={`mb-8 transition-all duration-1000 ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                        }`}
                >
                    <Wind className="w-24 h-24 mx-auto text-blue-400 animate-pulse" />
                </div>

                {/* Project Name */}
                <div
                    className={`transition-all duration-1000 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        CitySmog Watch
                    </h1>
                    <p className="text-slate-400 text-lg">Air Quality Monitoring System</p>
                </div>

                {/* Loading Bar */}
                <div
                    className={`mt-12 transition-all duration-1000 ${stage >= 3 ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div className="w-64 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-loading"></div>
                    </div>
                    <p className="text-slate-500 text-sm mt-4">Loading dashboard...</p>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes windBlow {
          0% {
            left: -100%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes loading {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-loading {
          animation: loading 1s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default LoadingScreen;
