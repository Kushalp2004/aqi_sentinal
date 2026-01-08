import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Calendar } from 'lucide-react';

const ForecastChart = ({ data }) => {
    const [view, setView] = useState('24h'); // '24h' or '3d'

    // Prepare data based on view
    const getChartData = () => {
        if (view === '24h') {
            return (data.hourly_forecast || []).slice(0, 24).map(item => ({
                time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', hour12: true }),
                aqi: item.aqi
            }));
        } else {
            // 3 Days (Hourly data for next 72 hours, sampled every 3 hours for cleaner chart)
            return (data.hourly_forecast || []).slice(0, 72).filter((_, i) => i % 3 === 0).map(item => ({
                time: new Date(item.time).toLocaleDateString([], { weekday: 'short', hour: '2-digit' }),
                aqi: item.aqi
            }));
        }
    };

    const chartData = getChartData();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-sm">
                    <p className="text-slate-300 mb-1">{label}</p>
                    <p className="text-lg font-bold text-blue-400">
                        AQI: {payload[0].value}
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
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        {view === '24h' ? (
                            <Clock className="w-5 h-5 text-blue-400" />
                        ) : (
                            <Calendar className="w-5 h-5 text-blue-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-200">AQI Forecast</h3>
                        <p className="text-slate-400 text-xs">
                            {view === '24h' ? 'Next 24 Hours' : 'Next 3 Days Trend'}
                        </p>
                    </div>
                </div>

                {/* Toggle Buttons */}
                <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                    <button
                        onClick={() => setView('24h')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === '24h'
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        24 Hours
                    </button>
                    <button
                        onClick={() => setView('3d')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === '3d'
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        3 Days
                    </button>
                </div>
            </div>

            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            interval="preserveStartEnd"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 2 }} />
                        <Area
                            type="monotone"
                            dataKey="aqi"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAqi)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ForecastChart;
