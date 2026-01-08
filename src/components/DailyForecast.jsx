import React from 'react';
import { Calendar } from 'lucide-react';

const DailyForecastItem = ({ date, aqi }) => {
    const getStatusColor = (val) => {
        if (val <= 50) return 'text-green-400';
        if (val <= 100) return 'text-yellow-400';
        if (val <= 200) return 'text-orange-400';
        if (val <= 300) return 'text-red-400';
        if (val <= 400) return 'text-purple-400';
        return 'text-rose-600';
    };

    return (
        <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/10 p-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-white">
                        {new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs text-gray-500">Average AQI</span>
                </div>
            </div>
            <div className={`text-xl font-bold ${getStatusColor(aqi)}`}>
                {Math.round(aqi)}
            </div>
        </div>
    );
};

const DailyForecast = ({ data }) => {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-semibold text-white">7-Day Forecast</h3>
            <div className="flex flex-col gap-3">
                {data.map((day) => (
                    <DailyForecastItem key={day.date} date={day.date} aqi={day.avg_aqi} />
                ))}
            </div>
        </div>
    );
};

export default DailyForecast;
