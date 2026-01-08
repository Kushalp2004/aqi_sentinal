import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const STATIONS = {
    "peenya": { name: "Peenya", lat: 13.0270, lon: 77.4940 },
    "btm_layout": { name: "BTM Layout", lat: 12.9128, lon: 77.6092 },
    "bwssb": { name: "BWSSB Kadabesanahalli", lat: 12.9389, lon: 77.6974 },
    "city_railway": { name: "City Railway Station", lat: 12.9772, lon: 77.5713 },
    "saneguruvanahalli": { name: "Saneguruvanahalli", lat: 12.9918, lon: 77.5458 },
    "hebbal": { name: "Hebbal", lat: 13.0305, lon: 77.5925 },
    "silk_board": { name: "Silk Board", lat: 12.9176, lon: 77.6235 },
    "jayanagar": { name: "Jayanagar", lat: 12.9209, lon: 77.5849 },
    "hombegowda": { name: "Hombegowda Nagar", lat: 12.9366, lon: 77.5927 },
    "mysore_road": { name: "Mysore Road", lat: 12.9567, lon: 77.5262 }
};

const StationSelector = ({ selectedStation, onStationChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const currentStation = STATIONS[selectedStation];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            >
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-slate-200 font-medium">{currentStation.name}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto">
                        {Object.entries(STATIONS).map(([id, station]) => (
                            <button
                                key={id}
                                onClick={() => {
                                    onStationChange(id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-b-0 ${selectedStation === id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedStation === id ? 'text-blue-400' : 'text-slate-500'}`} />
                                    <div className="flex-1">
                                        <div className="font-medium">{station.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            {station.lat.toFixed(4)}°N, {station.lon.toFixed(4)}°E
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default StationSelector;
export { STATIONS };
