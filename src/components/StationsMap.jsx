import React from 'react';
import { Navigation } from 'lucide-react';
import { STATIONS } from './StationSelector';

const StationsMap = ({ selectedStation, onStationChange }) => {
    const getAQIColor = (aqi) => {
        if (aqi <= 50) return '#10b981';
        if (aqi <= 100) return '#f59e0b';
        if (aqi <= 200) return '#f97316';
        if (aqi <= 300) return '#ef4444';
        if (aqi <= 400) return '#a855f7';
        return '#ec4899';
    };

    // Mock AQI data for stations (you can replace with actual data)
    const stationData = {
        peenya: { x: 30, y: 35, aqi: 156 },
        btm_layout: { x: 55, y: 70, aqi: 142 },
        bwssb: { x: 75, y: 60, aqi: 138 },
        city_railway: { x: 45, y: 45, aqi: 165 },
        saneguruvanahalli: { x: 35, y: 40, aqi: 148 },
        hebbal: { x: 50, y: 25, aqi: 134 },
        silk_board: { x: 60, y: 65, aqi: 168 },
        jayanagar: { x: 50, y: 75, aqi: 151 },
        hombegowda: { x: 52, y: 55, aqi: 145 },
        mysore_road: { x: 25, y: 60, aqi: 152 }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Navigation className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-200">Monitoring Stations</h3>
                        <p className="text-slate-400 text-xs">Click a station to view its data</p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative bg-slate-800/50 rounded-xl p-4 h-[400px] overflow-hidden">
                {/* Bangalore Map Background */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Background */}
                    <rect width="100" height="100" fill="#1e293b" rx="4" />

                    {/* Grid Lines */}
                    <g stroke="#334155" strokeWidth="0.2" opacity="0.3">
                        {[...Array(10)].map((_, i) => (
                            <React.Fragment key={i}>
                                <line x1={i * 10} y1="0" x2={i * 10} y2="100" />
                                <line x1="0" y1={i * 10} x2="100" y2={i * 10} />
                            </React.Fragment>
                        ))}
                    </g>

                    {/* Bangalore Outline (simplified) */}
                    <path
                        d="M 20,30 L 25,20 L 40,15 L 60,18 L 75,25 L 80,40 L 78,60 L 70,75 L 55,85 L 35,88 L 20,80 L 15,60 L 18,45 Z"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                    />

                    {/* Station Markers */}
                    {Object.entries(stationData).map(([id, { x, y, aqi }]) => {
                        // Only show if station exists in STATIONS
                        if (!STATIONS[id]) return null;

                        const isSelected = selectedStation === id;
                        const color = getAQIColor(aqi);

                        return (
                            <g
                                key={id}
                                className="cursor-pointer transition-transform hover:scale-110"
                                onClick={() => onStationChange(id)}
                            >
                                {/* Glow effect for selected station */}
                                {isSelected && (
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="6"
                                        fill={color}
                                        opacity="0.3"
                                        className="animate-ping"
                                    />
                                )}

                                {/* Station Marker */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isSelected ? "4" : "3"}
                                    fill={color}
                                    stroke="white"
                                    strokeWidth={isSelected ? "1" : "0.5"}
                                />

                                {/* Station Label */}
                                <text
                                    x={x}
                                    y={y - 6}
                                    textAnchor="middle"
                                    className="text-[3px] fill-slate-300 font-semibold"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {STATIONS[id]?.name.split(' ')[0]}
                                </text>

                                {/* AQI Value */}
                                <text
                                    x={x}
                                    y={y + 10}
                                    textAnchor="middle"
                                    className="text-[2.5px] fill-slate-400"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {aqi}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-400">Good (0-50)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-slate-400">Moderate (51-100)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-slate-400">Poor (101-200)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-slate-400">Unhealthy (201-300)</span>
                </div>
            </div>
        </div>
    );
};

export default StationsMap;
