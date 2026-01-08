import React from 'react';
import { Stethoscope, AlertTriangle } from 'lucide-react';

const DoctorAdvice = ({ data }) => {
    const primaryPollutant = data.primary_pollutant?.toLowerCase() || 'pm2_5';

    // Rule-based advice system
    const getAdvice = (pollutant) => {
        const adviceMap = {
            'pm2_5': {
                icon: '😷',
                title: 'Fine Particle Alert',
                advice: 'Wear an N95 mask. Fine particles can enter the bloodstream.',
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/10',
                borderColor: 'border-orange-500/30'
            },
            'pm10': {
                icon: '🌫️',
                title: 'Coarse Particle Alert',
                advice: 'Limit outdoor activities. Coarse particles can irritate airways.',
                color: 'text-amber-400',
                bgColor: 'bg-amber-500/10',
                borderColor: 'border-amber-500/30'
            },
            'o3': {
                icon: '☀️',
                title: 'Ozone Alert',
                advice: 'Avoid going out in the afternoon sun. Ozone irritates the lungs.',
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30'
            },
            'no2': {
                icon: '🚗',
                title: 'Traffic Pollution Alert',
                advice: 'Heavy traffic pollution detected. Avoid main roads.',
                color: 'text-red-400',
                bgColor: 'bg-red-500/10',
                borderColor: 'border-red-500/30'
            },
            'so2': {
                icon: '🏭',
                title: 'Industrial Pollution Alert',
                advice: 'Industrial emissions detected. Stay away from industrial areas.',
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/10',
                borderColor: 'border-purple-500/30'
            },
            'co': {
                icon: '💨',
                title: 'Carbon Monoxide Alert',
                advice: 'Poor ventilation detected. Ensure proper air circulation indoors.',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-500/10',
                borderColor: 'border-yellow-500/30'
            },
            'nh3': {
                icon: '🌾',
                title: 'Ammonia Alert',
                advice: 'Agricultural emissions detected. Limit exposure if sensitive.',
                color: 'text-green-400',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/30'
            }
        };

        return adviceMap[pollutant] || adviceMap['pm2_5'];
    };

    const advice = getAdvice(primaryPollutant);
    const currentAQI = data.current_aqi || 0;

    // Additional general advice based on AQI level
    const getGeneralAdvice = (aqi) => {
        if (aqi <= 50) return 'Air quality is good. Enjoy outdoor activities!';
        if (aqi <= 100) return 'Sensitive individuals should limit prolonged outdoor exertion.';
        if (aqi <= 200) return 'Everyone should reduce prolonged outdoor exertion.';
        if (aqi <= 300) return 'Avoid all outdoor activities. Stay indoors.';
        return 'Health alert! Avoid all outdoor exposure. Seek medical help if needed.';
    };

    return (
        <div className={`${advice.bgColor} backdrop-blur-md border ${advice.borderColor} rounded-2xl p-6 relative overflow-hidden`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Stethoscope className={`w-5 h-5 ${advice.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">Doctor's Advice</h3>
                </div>

                {/* Primary Pollutant Alert */}
                <div className="mb-4 p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">{advice.icon}</span>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className={`w-4 h-4 ${advice.color}`} />
                                <h4 className={`font-semibold ${advice.color}`}>{advice.title}</h4>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{advice.advice}</p>
                        </div>
                    </div>
                </div>

                {/* General AQI-based Advice */}
                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                    <p className="text-slate-300 text-sm">
                        <span className="font-semibold text-slate-200">General: </span>
                        {getGeneralAdvice(currentAQI)}
                    </p>
                </div>

                {/* Additional Tips */}
                <div className="mt-4 pt-4 border-t border-slate-700/30">
                    <p className="text-xs text-slate-400 mb-2">💡 Additional Tips:</p>
                    <ul className="space-y-1 text-xs text-slate-400">
                        <li>• Keep windows closed during high pollution hours</li>
                        <li>• Use air purifiers indoors if available</li>
                        <li>• Stay hydrated to help your body filter pollutants</li>
                        <li>• Consult a doctor if you experience breathing difficulties</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorAdvice;
