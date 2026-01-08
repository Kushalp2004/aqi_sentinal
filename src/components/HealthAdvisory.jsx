import React from 'react';
import { AlertTriangle, CheckCircle, Activity, ShieldAlert } from 'lucide-react';

const getAdvisory = (aqi) => {
    if (aqi <= 50) return {
        message: "Air quality is good. Minimal impact.",
        activity: "Safe for all outdoor activities.",
        icon: CheckCircle,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20"
    };
    if (aqi <= 100) return {
        message: "Air quality is satisfactory. Minor breathing discomfort to sensitive people.",
        activity: "Enjoy outdoor activities, but sensitive groups should be cautious.",
        icon: CheckCircle,
        color: "text-lime-500",
        bg: "bg-lime-500/10",
        border: "border-lime-500/20"
    };
    if (aqi <= 200) return {
        message: "Air quality is moderate. Breathing discomfort to people with lungs, asthma and heart diseases.",
        activity: "Avoid prolonged outdoor exertion if you have respiratory issues.",
        icon: Activity,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20"
    };
    if (aqi <= 300) return {
        message: "Air quality is poor. Breathing discomfort to most people on prolonged exposure.",
        activity: "Reduce outdoor activities. Wear a mask if necessary.",
        icon: AlertTriangle,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
    };
    if (aqi <= 400) return {
        message: "Air quality is very poor. Respiratory illness on prolonged exposure.",
        activity: "Avoid outdoor activities. Keep windows closed.",
        icon: ShieldAlert,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    };
    return {
        message: "Air quality is severe. Affects healthy people and seriously impacts those with existing diseases.",
        activity: "Avoid all outdoor physical activities. Remain indoors.",
        icon: ShieldAlert,
        color: "text-rose-900",
        bg: "bg-rose-900/10",
        border: "border-rose-900/20"
    };
};

const HealthAdvisory = ({ data }) => {
    const { current_aqi } = data;
    const advisory = getAdvisory(current_aqi);
    const Icon = advisory.icon;

    return (
        <div className={`rounded-2xl p-6 border ${advisory.border} ${advisory.bg} backdrop-blur-sm`}>
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-slate-950/30 ${advisory.color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className={`text-lg font-semibold mb-2 ${advisory.color}`}>Health Advisory</h3>
                    <p className="text-slate-300 mb-3">{advisory.message}</p>
                    <div className="text-sm font-medium text-slate-400 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                        <span className="uppercase text-xs tracking-wider text-slate-500 block mb-1">Recommendation</span>
                        {advisory.activity}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthAdvisory;
