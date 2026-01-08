import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChartIcon } from 'lucide-react';

const PollutantPieChart = ({ data }) => {
    const { current_pollutants } = data;

    const chartData = [
        { name: 'PM2.5', value: current_pollutants.pm2_5.sub_index, color: '#3b82f6' },
        { name: 'PM10', value: current_pollutants.pm10.sub_index, color: '#8b5cf6' },
        { name: 'NO₂', value: current_pollutants.no2.sub_index, color: '#10b981' },
        { name: 'CO', value: current_pollutants.co.sub_index, color: '#f59e0b' },
        { name: 'SO₂', value: current_pollutants.so2.sub_index, color: '#ef4444' },
        { name: 'O₃', value: current_pollutants.o3.sub_index, color: '#ec4899' },
        { name: 'NH₃', value: current_pollutants.nh3.sub_index, color: '#14b8a6' },
    ].filter(item => item.value > 0);

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-500/10 rounded-lg">
                    <PieChartIcon className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-200">Pollutant Contribution</h3>
                    <p className="text-slate-400 text-xs">Based on Sub-Index values</p>
                </div>
            </div>

            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                borderColor: '#334155',
                                borderRadius: '8px',
                                color: '#f8fafc'
                            }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PollutantPieChart;
