import React from 'react';
import { Thermometer, Droplets, Wind, Eye, CloudRain, Gauge } from 'lucide-react';

const WeatherItem = ({ icon: Icon, label, value, unit }) => (
    <div className="flex flex-col items-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
        <Icon className="mb-2 h-6 w-6 text-blue-400" />
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-lg font-semibold text-white">
            {value} <span className="text-sm text-gray-500">{unit}</span>
        </span>
    </div>
);

const WeatherGrid = ({ weather }) => {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <WeatherItem icon={Thermometer} label="Temperature" value={weather.temperature} unit="°C" />
            <WeatherItem icon={Droplets} label="Humidity" value={weather.humidity} unit="%" />
            <WeatherItem icon={Wind} label="Wind Speed" value={weather.wind_speed} unit="km/h" />
            <WeatherItem icon={Eye} label="Visibility" value={(weather.visibility / 1000).toFixed(1)} unit="km" />
            <WeatherItem icon={CloudRain} label="Precipitation" value={weather.precipitation} unit="mm" />
            <WeatherItem icon={Gauge} label="Pressure" value={weather.pressure} unit="hPa" />
        </div>
    );
};

export default WeatherGrid;
