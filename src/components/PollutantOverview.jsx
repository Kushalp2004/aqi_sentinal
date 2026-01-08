import React, { useState } from 'react';
import { X } from 'lucide-react';

const pollutantInfo = {
    pm2_5: {
        name: 'PM2.5 (Fine Particulate Matter)',
        description: 'Particles smaller than 2.5 micrometers',
        sources: [
            'Vehicle emissions (especially diesel)',
            'Industrial combustion',
            'Construction and road dust',
            'Biomass burning (wood, crop residue)',
            'Coal-fired power plants'
        ],
        health: 'Can penetrate deep into lungs and enter bloodstream, causing respiratory and cardiovascular problems'
    },
    pm10: {
        name: 'PM10 (Coarse Particulate Matter)',
        description: 'Particles smaller than 10 micrometers',
        sources: [
            'Road dust and vehicle emissions',
            'Construction activities',
            'Industrial processes',
            'Agricultural operations',
            'Windblown dust'
        ],
        health: 'Causes respiratory issues, aggravates asthma, and reduces lung function'
    },
    no2: {
        name: 'NO₂ (Nitrogen Dioxide)',
        description: 'Reddish-brown toxic gas',
        sources: [
            'Motor vehicle exhaust',
            'Power plants and industrial facilities',
            'Ships and aircraft',
            'Gas stoves and heaters',
            'Cigarette smoke'
        ],
        health: 'Inflames airways, reduces immunity to lung infections, and aggravates asthma'
    },
    co: {
        name: 'CO (Carbon Monoxide)',
        description: 'Colorless, odorless toxic gas',
        sources: [
            'Incomplete combustion of fossil fuels',
            'Vehicle exhaust',
            'Generators and engines',
            'Charcoal grills and stoves',
            'Industrial processes'
        ],
        health: 'Reduces oxygen delivery to organs and tissues, can be fatal in high concentrations'
    },
    so2: {
        name: 'SO₂ (Sulfur Dioxide)',
        description: 'Pungent, colorless gas',
        sources: [
            'Coal and oil-fired power plants',
            'Metal smelting and processing',
            'Diesel engines',
            'Petroleum refineries',
            'Volcanic eruptions'
        ],
        health: 'Irritates respiratory system, triggers asthma attacks, worsens heart disease'
    },
    o3: {
        name: 'O₃ (Ground-level Ozone)',
        description: 'Secondary pollutant formed by chemical reactions',
        sources: [
            'Formed from NO₂ and VOCs in sunlight',
            'Vehicle emissions (precursors)',
            'Industrial emissions (precursors)',
            'Chemical solvents',
            'Not directly emitted'
        ],
        health: 'Damages lung tissue, aggravates respiratory diseases, reduces lung function'
    }
};

const PollutantModal = ({ pollutant, onClose }) => {
    if (!pollutant) return null;
    const info = pollutantInfo[pollutant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-blue-400">{info.name}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-slate-300 text-sm mb-4 italic">{info.description}</p>

                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-orange-500 rounded"></span>
                        Main Sources:
                    </h4>
                    <ul className="space-y-1.5 ml-4">
                        {info.sources.map((source, idx) => (
                            <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                                <span className="text-orange-400 mt-1">•</span>
                                <span>{source}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-red-400 mb-1">Health Impact:</h4>
                    <p className="text-slate-300 text-sm">{info.health}</p>
                </div>
            </div>
        </div>
    );
};

const PollutantCard = ({ name, value, subIndex, unit = 'µg/m³', onClick }) => {
    const getProgressColor = (val) => {
        if (val < 50) return 'bg-green-500';
        if (val < 100) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex flex-col cursor-pointer hover:bg-slate-800/70 hover:border-slate-600 transition-all hover:scale-105"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 font-medium text-sm uppercase">{name}</span>
                <span className="text-slate-200 font-bold text-sm">
                    {value.toFixed(1)} <span className="text-xs text-slate-500 font-normal">{unit}</span>
                </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getProgressColor(subIndex)} transition-all duration-500`}
                    style={{ width: `${Math.min(subIndex, 100)}%` }}
                ></div>
            </div>
            <div className="text-xs text-slate-500 mt-2 text-center opacity-0 group-hover:opacity-100">
                Click for details
            </div>
        </div>
    );
};

const PollutantOverview = ({ data }) => {
    const { current_pollutants } = data;
    const [selectedPollutant, setSelectedPollutant] = useState(null);

    const pollutants = [
        { key: 'pm2_5', name: 'PM2.5' },
        { key: 'pm10', name: 'PM10' },
        { key: 'no2', name: 'NO₂' },
        { key: 'co', name: 'CO' },
        { key: 'so2', name: 'SO₂' },
        { key: 'o3', name: 'O₃' },
    ];

    return (
        <>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
                <h3 className="text-xl font-semibold text-slate-200 mb-3">Pollutants Overview</h3>
                <p className="text-xs text-slate-500 mb-3">Click on any pollutant to learn about its sources</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {pollutants.map((p) => (
                        <PollutantCard
                            key={p.key}
                            name={p.name}
                            value={current_pollutants[p.key].value}
                            subIndex={current_pollutants[p.key].sub_index}
                            onClick={() => setSelectedPollutant(p.key)}
                        />
                    ))}
                </div>
            </div>

            <PollutantModal
                pollutant={selectedPollutant}
                onClose={() => setSelectedPollutant(null)}
            />
        </>
    );
};

export default PollutantOverview;
