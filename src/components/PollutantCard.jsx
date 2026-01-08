import React from 'react';

const PollutantItem = ({ name, value, subIndex }) => {
    // Simple color logic based on sub-index (assuming similar scale to AQI for simplicity)
    const getColor = (val) => {
        if (val <= 50) return 'bg-green-500';
        if (val <= 100) return 'bg-yellow-500';
        if (val <= 200) return 'bg-orange-500';
        if (val <= 300) return 'bg-red-500';
        if (val <= 400) return 'bg-purple-500';
        return 'bg-rose-600';
    };

    return (
        <div className="flex flex-col gap-1 rounded-xl bg-white/5 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gray-300 uppercase">{name}</span>
                <span className="text-xs text-gray-500">Sub-Index: {Math.round(subIndex)}</span>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                <div
                    className={`h-full rounded-full ${getColor(subIndex)} transition-all duration-500`}
                    style={{ width: `${Math.min((subIndex / 500) * 100, 100)}%` }}
                />
            </div>
        </div>
    );
};

const PollutantCard = ({ pollutants }) => {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-semibold text-white">Pollutant Breakdown</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {Object.entries(pollutants).map(([key, data]) => (
                    <PollutantItem key={key} name={key} value={data.value} subIndex={data.sub_index} />
                ))}
            </div>
        </div>
    );
};

export default PollutantCard;
