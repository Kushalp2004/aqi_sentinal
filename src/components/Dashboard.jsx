import React, { useState, useEffect } from 'react';
import CurrentAQI from './CurrentAQI';
import ForecastChart from './ForecastChart';
import PollutantOverview from './PollutantOverview';
import WeatherInfo from './WeatherInfo';
import PollutantPieChart from './PollutantPieChart';
import HistoricalTrends from './HistoricalTrends';
import DoctorAdvice from './DoctorAdvice';
import WeeklyForecast from './WeeklyForecast';
import StationSelector, { STATIONS } from './StationSelector';
import LocationChangeNotification from './LocationChangeNotification';
import StationsMap from './StationsMap';
// Import the local forecast data directly
import allForecastsData from '../../all_forecasts.json';

const Dashboard = () => {
    const [selectedStation, setSelectedStation] = useState('peenya');
    const [data, setData] = useState(allForecastsData[selectedStation] || allForecastsData.peenya);
    const [showNotification, setShowNotification] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [previousStation, setPreviousStation] = useState('peenya');

    // Update data when selected station changes
    useEffect(() => {
        if (selectedStation !== previousStation && allForecastsData[selectedStation]) {
            setShowNotification(true);
            setIsTransitioning(true);

            setTimeout(() => {
                setData(allForecastsData[selectedStation]);
                setPreviousStation(selectedStation);

                setTimeout(() => {
                    setIsTransitioning(false);
                }, 150);
            }, 400);
        }
    }, [selectedStation, previousStation]);

    if (!data) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 font-sans">
            {showNotification && (
                <LocationChangeNotification
                    stationName={STATIONS[selectedStation]?.name}
                    onClose={() => setShowNotification(false)}
                />
            )}

            <div
                className={`max-w-[1600px] mx-auto space-y-5 transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-30' : 'opacity-100'
                    }`}
            >
                <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                            CitySmog Watch
                        </h1>
                        <p className="text-slate-400 mt-1 text-sm">Real-time Air Quality Monitoring & Forecasting</p>
                    </div>

                    <StationSelector
                        selectedStation={selectedStation}
                        onStationChange={setSelectedStation}
                    />

                    <div className="text-right">
                        <div className="text-xs text-slate-500 mb-1">Data Updated</div>
                        <div className="font-mono text-slate-300 text-sm">
                            {new Date(data.current_conditions_time).toLocaleString()}
                        </div>
                        <div className="text-xs text-green-500 mt-1 flex items-center gap-1 justify-end">
                            <span>✓</span> Local forecast data
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2">
                        <CurrentAQI data={data} stationInfo={STATIONS[selectedStation]} />
                    </div>
                    <div className="lg:col-span-1 flex flex-col gap-5">
                        <WeatherInfo data={data} />
                        <PollutantOverview data={data} />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <ForecastChart data={data} />
                            <WeeklyForecast data={data} />
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <DoctorAdvice data={data} />
                    </div>
                    <div className="lg:col-span-1">
                        <PollutantPieChart data={data} />
                    </div>

                    <div className="lg:col-span-2">
                        <HistoricalTrends />
                    </div>
                    <div className="lg:col-span-1">
                        <StationsMap
                            selectedStation={selectedStation}
                            onStationChange={setSelectedStation}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
