import React from 'react';
import { Wind } from 'lucide-react';

const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' };
    if (aqi <= 100) return { label: 'Satisfactory', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' };
    if (aqi <= 200) return { label: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50' };
    if (aqi <= 300) return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' };
    if (aqi <= 400) return { label: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/50' };
    return { label: 'Severe', color: 'text-rose-600', bg: 'bg-rose-600/20', border: 'border-rose-600/50' };
};

const CurrentAQICard = ({ aqi, primaryPollutant, time }) => {
    const status = getAQIStatus(aqi);

    return (
        <div className={`relative overflow-hidden rounded-3xl border ${status.border} ${status.bg} p-8 shadow-lg backdrop-blur-md transition-all hover:scale-[1.02]`}>
            <div className="flex flex-col items-center justify-center text-center">
                <h2 className="mb-2 text-lg font-medium text-gray-300">Current AQI</h2>
                <div className={`text-8xl font-bold tracking-tighter ${status.color}`}>
                    {Math.round(aqi)}
                </div>
                <div className={`mt-2 rounded-full px-4 py-1 text-sm font-semibold ${status.color} bg-black/20`}>
                    {status.label}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
                    <span>Primary Pollutant:</span>
                    <span className="font-mono font-bold text-white uppercase">{primaryPollutant}</span>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                    Updated: {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

export default CurrentAQICard;
