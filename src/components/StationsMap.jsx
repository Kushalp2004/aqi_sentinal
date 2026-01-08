import React from 'react';
import { Navigation } from 'lucide-react';
import { STATIONS } from './StationSelector';

const StationsMap = ({ selectedStation, onStationChange, allData }) => {
    const getAQIColor = (aqi) => {
        if (!aqi) return '#334155'; // Dark gray if data is missing
        if (aqi <= 50) return '#10b981';
        if (aqi <= 100) return '#f59e0b';
        if (aqi <= 200) return '#f97316';
        if (aqi <= 300) return '#ef4444';
        if (aqi <= 400) return '#a855f7';
        return '#ec4899';
    };

    // These coordinates (x, y) represent the custom map layout
    const stationLayout = {
        peenya: { x: 30, y: 35 },
        btm_layout: { x: 55, y: 70 },
        bwssb: { x: 75, y: 60 },
        city_railway: { x: 45, y: 45 },
        saneguruvanahalli: { x: 35, y: 40 },
        hebbal: { x: 50, y: 25 },
        silk_board: { x: 60, y: 75 },
        jayanagar: { x: 48, y: 65 },
        hombegowda: { x: 52, y: 55 },
        mysore_road: { x: 32, y: 55 }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
                <Navigation className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Live Station Network</h3>
            </div>

            <div className="relative aspect-square bg-slate-950/50 rounded-2xl border border-slate-800/50 overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Simplified city grid lines */}
                    <path d="M0 50 L100 50 M50 0 L50 100" stroke="#1e293b" strokeWidth="0.5" />
                    
                    {Object.entries(STATIONS).map(([id, station]) => {
                        const layout = stationLayout[id];
                        // FETCH: Use real AQI from the allData object
                        const aqi = allData?.[id]?.current_aqi || 0;
                        const isSelected = selectedStation === id;

                        return (
                            <g 
                                key={id} 
                                onClick={() => onStationChange(id)}
                                className="cursor-pointer group"
                            >
                                <circle
                                    cx={layout.x}
                                    cy={layout.y}
                                    r={isSelected ? 4 : 2.5}
                                    fill={getAQIColor(aqi)}
                                    className={`transition-all duration-300 ${isSelected ? 'stroke-white stroke-[1.5]' : 'hover:r-4'}`}
                                />
                                {isSelected && (
                                    <circle
                                        cx={layout.x}
                                        cy={layout.y}
                                        r={6}
                                        fill="none"
                                        stroke={getAQIColor(aqi)}
                                        strokeWidth="0.5"
                                        className="animate-ping"
                                    />
                                )}
                                <text
                                    x={layout.x}
                                    y={layout.y - 6}
                                    textAnchor="middle"
                                    className="text-[3px] fill-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {station.name}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Dynamic Legend */}
            <div className="mt-6 space-y-2">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Network Status</div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-[#10b981]"></div> Good
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Moderate
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> Unhealthy
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-[#334155]"></div> Offline
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StationsMap;
