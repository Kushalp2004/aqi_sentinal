import React from 'react';

const PollutionHeatmap = () => {
    // Mock Data: Days of week vs Time of day (Morning, Afternoon, Evening, Night)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const times = ['Morning', 'Afternoon', 'Evening', 'Night'];

    // Generate random intensity (0-100)
    const data = days.map(day => ({
        day,
        values: times.map(time => Math.floor(Math.random() * 100))
    }));

    const getColor = (value) => {
        // Heatmap gradient from Green to Red
        if (value < 30) return 'bg-green-500/40 text-green-100';
        if (value < 60) return 'bg-yellow-500/40 text-yellow-100';
        if (value < 80) return 'bg-orange-500/40 text-orange-100';
        return 'bg-red-500/40 text-red-100';
    };

    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-slate-200 mb-6">Pollution Heatmap (Weekly Pattern)</h3>

            <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                    <div className="grid grid-cols-5 gap-2 mb-2">
                        <div className="text-slate-500 text-sm font-medium"></div>
                        {times.map(time => (
                            <div key={time} className="text-slate-400 text-sm font-medium text-center">{time}</div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {data.map((row) => (
                            <div key={row.day} className="grid grid-cols-5 gap-2">
                                <div className="text-slate-400 text-sm font-medium flex items-center">{row.day}</div>
                                {row.values.map((val, i) => (
                                    <div
                                        key={i}
                                        className={`h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-105 cursor-default ${getColor(val)}`}
                                        title={`Intensity: ${val}%`}
                                    >
                                        {val}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">Intensity based on historical averages</p>
        </div>
    );
};

export default PollutionHeatmap;
