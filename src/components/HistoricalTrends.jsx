import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HistoricalTrends = () => {
    const [range, setRange] = useState('7d');

    // Mock Data Generation
    const generateData = (days) => {
        const data = [];
        const today = new Date();
        for (let i = days; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            // Random AQI between 50 and 150 for realism
            const aqi = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
            data.push({
                date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                aqi: aqi
            });
        }
        return data;
    };

    const data = generateData(range === '7d' ? 7 : 30);

    const getBarColor = (aqi) => {
        if (aqi <= 50) return '#22c55e';
        if (aqi <= 100) return '#eab308';
        if (aqi <= 150) return '#f97316';
        return '#ef4444';
    };

    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-200">Historical Trends</h3>
                <div className="flex bg-slate-700/50 rounded-lg p-1">
                    <button
                        onClick={() => setRange('7d')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${range === '7d' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setRange('30d')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${range === '30d' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Last 30 Days
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            interval={range === '30d' ? 2 : 0}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#334155', opacity: 0.4 }}
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.aqi)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HistoricalTrends;
