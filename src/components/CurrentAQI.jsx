import React from 'react';
import { MapPin } from 'lucide-react';

const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-100', bg: 'from-emerald-400/80 to-teal-500/80' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-100', bg: 'from-amber-400/80 to-orange-400/80' };
    if (aqi <= 200) return { label: 'Poor', color: 'text-orange-100', bg: 'from-orange-400/80 to-red-400/80' };
    if (aqi <= 300) return { label: 'Unhealthy', color: 'text-red-100', bg: 'from-red-500/80 to-rose-500/80' };
    if (aqi <= 400) return { label: 'Severe', color: 'text-purple-100', bg: 'from-purple-500/80 to-indigo-500/80' };
    return { label: 'Hazardous', color: 'text-pink-100', bg: 'from-pink-500/80 to-rose-600/80' };
};

const CurrentAQI = ({ data, stationInfo }) => {
    const { current_aqi, current_pollutants } = data;
    const status = getAQIStatus(current_aqi);
    const displayName = stationInfo?.name || "Bengaluru";

    const pm25 = current_pollutants?.pm2_5?.value || 0;
    const pm10 = current_pollutants?.pm10?.value || 0;

    const getScalePosition = (aqi) => {
        const maxAQI = 500;
        return Math.min((aqi / maxAQI) * 100, 100);
    };

    const Avatar = ({ aqi }) => {
        const isHappy = aqi <= 100;

        return (
            <svg viewBox="0 0 200 200" className="w-40 h-40 drop-shadow-2xl">
                <path d="M60 140 Q100 180 140 140 L140 200 L60 200 Z" fill={isHappy ? "#4ADE80" : "#F87171"} />
                <circle cx="100" cy="90" r="50" fill="#FCD34D" />
                <path d="M50 80 Q100 20 150 80" fill="#4B5563" stroke="#4B5563" strokeWidth="10" strokeLinecap="round" />
                {isHappy ? (
                    <>
                        <circle cx="80" cy="80" r="5" fill="#1F2937" />
                        <circle cx="120" cy="80" r="5" fill="#1F2937" />
                        <path d="M80 100 Q100 120 120 100" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                    </>
                ) : (
                    <>
                        <circle cx="80" cy="80" r="5" fill="#1F2937" />
                        <circle cx="120" cy="80" r="5" fill="#1F2937" />
                        <path d="M60 95 Q100 130 140 95 L135 125 Q100 145 65 125 Z" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                        <path d="M55 90 L65 100" stroke="white" strokeWidth="2" />
                        <path d="M145 90 L135 100" stroke="white" strokeWidth="2" />
                    </>
                )}
            </svg>
        );
    };

    return (
        <div className={`relative bg-gradient-to-br ${status.bg} backdrop-blur-md border border-white/10 rounded-3xl p-5 overflow-hidden h-full`}>

            <div className="absolute bottom-0 right-4 z-10 opacity-90 transform translate-y-4">
                <Avatar aqi={current_aqi} />
            </div>

            <div className="relative z-20 max-w-[70%]">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-sm font-medium">Live AQI</span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                        <div className={`text-6xl font-black ${status.color} leading-none mb-2`}>
                            {Math.round(current_aqi)}
                        </div>
                        <div className="text-white/60 text-sm">(AQI India)</div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="text-white/70 text-sm mb-1">Air Quality is</div>
                        <div className={`text-2xl font-bold ${status.color} leading-tight`}>
                            {status.label}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <div>
                        <span className="text-white/60 text-sm">PM10:</span>
                        <span className="text-white font-semibold ml-2">{pm10.toFixed(0)} µg/m³</span>
                    </div>
                    <div>
                        <span className="text-white/60 text-sm">PM2.5:</span>
                        <span className="text-white font-semibold ml-2">{pm25.toFixed(0)} µg/m³</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>Good</span>
                        <span>Moderate</span>
                        <span>Poor</span>
                        <span>Unhealthy</span>
                        <span>Severe</span>
                        <span>Hazardous</span>
                    </div>

                    <div className="relative h-3 rounded-full overflow-hidden bg-white/10">
                        <div className="absolute inset-0 flex">
                            <div className="flex-1 bg-green-500"></div>
                            <div className="flex-1 bg-yellow-500"></div>
                            <div className="flex-1 bg-orange-500"></div>
                            <div className="flex-1 bg-red-500"></div>
                            <div className="flex-1 bg-purple-600"></div>
                            <div className="flex-1 bg-pink-600"></div>
                        </div>

                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-4 border-slate-900 shadow-lg"
                            style={{ left: `${getScalePosition(current_aqi)}%`, transform: 'translate(-50%, -50%)' }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-xs text-white/50">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                        <span>150</span>
                        <span>200</span>
                        <span>300</span>
                        <span>301+</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-white/60">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{displayName}</span>
                </div>
            </div>
        </div>
    );
};

export default CurrentAQI;
