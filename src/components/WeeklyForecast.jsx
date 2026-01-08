import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalendarDays } from 'lucide-react';

const WeeklyForecast = ({ data }) => {
    const dailyData = data.daily_forecast || [];

    // Helper to get color based on AQI
    const getBarColor = (aqi) => {
        if (aqi <= 50) return '#10B981'; // Green
        if (aqi <= 100) return '#F59E0B'; // Yellow
        if (aqi <= 200) return '#F97316'; // Orange
        if (aqi <= 300) return '#EF4444'; // Red
        if (aqi <= 400) return '#8B5CF6'; // Purple
        return '#EC4899'; // Pink
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const aqi = payload[0].value;
            return (
                <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-sm">
                    <p className="text-slate-300 mb-1">{label}</p>
                    <p className="text-lg font-bold text-white">
                        AQI: <span style={{ color: getBarColor(aqi) }}>{aqi}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-4 h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <CalendarDays className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-200">7-Day Forecast</h3>
                        <p className="text-slate-400 text-xs">Predicted Daily Average AQI</p>
                    </div>
                </div>
            </div>

            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
                        <Bar dataKey="avg_aqi" radius={[4, 4, 0, 0]} barSize={40}>
                            {dailyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.avg_aqi)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeeklyForecast;
