import React from 'react';
import { Eye, Droplets, Thermometer, Wind } from 'lucide-react';

const WeatherItem = ({ icon: Icon, label, value, unit }) => (
    <div className="flex items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <div className="p-2 bg-slate-700/50 rounded-lg mr-3">
            <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
            <div className="text-xs text-slate-400">{label}</div>
            <div className="text-lg font-semibold text-slate-200">{value}{unit}</div>
        </div>
    </div>
);

const WeatherInfo = ({ data }) => {
    const { current_weather } = data;

    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
            <h3 className="text-xl font-semibold text-slate-200 mb-3">Weather Conditions</h3>
            <div className="grid grid-cols-2 gap-4">
                <WeatherItem
                    icon={Thermometer}
                    label="Temperature"
                    value={current_weather.temperature}
                    unit="°C"
                />
                <WeatherItem
                    icon={Droplets}
                    label="Humidity"
                    value={current_weather.humidity}
                    unit="%"
                />
                <WeatherItem
                    icon={Wind}
                    label="Wind Speed"
                    value={current_weather.wind_speed}
                    unit=" km/h"
                />
                <WeatherItem
                    icon={Eye}
                    label="Visibility"
                    value={(current_weather.visibility / 1000).toFixed(1)}
                    unit=" km"
                />
            </div>
        </div>
    );
};

export default WeatherInfo;
