import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  LineChart as ChartIcon, 
  ShieldAlert,
  Percent,
  Database
} from 'lucide-react';

const analyticsMockData = {
  3: [
    { name: 'Month 1', historical: 78, projected: 78 },
    { name: 'Month 2', historical: 81, projected: 82 },
    { name: 'Month 3', historical: 84, projected: 86 },
  ],
  6: [
    { name: 'Month 1', historical: 78, projected: 78 },
    { name: 'Month 2', historical: 81, projected: 82 },
    { name: 'Month 3', historical: 84, projected: 86 },
    { name: 'Month 4', historical: null, projected: 90 },
    { name: 'Month 5', historical: null, projected: 93 },
    { name: 'Month 6', historical: null, projected: 97 },
  ],
  12: [
    { name: 'M1', historical: 78, projected: 78 },
    { name: 'M2', historical: 81, projected: 82 },
    { name: 'M3', historical: 84, projected: 86 },
    { name: 'M4', historical: null, projected: 90 },
    { name: 'M5', historical: null, projected: 93 },
    { name: 'M6', historical: null, projected: 97 },
    { name: 'M7', historical: null, projected: 101 },
    { name: 'M8', historical: null, projected: 104 },
    { name: 'M9', historical: null, projected: 108 },
    { name: 'M10', historical: null, projected: 111 },
    { name: 'M11', historical: null, projected: 115 },
    { name: 'M12', historical: null, projected: 119 },
  ]
};

const wearDistribution = [
  { name: 'Conveyor Belt B-04 Roller', wear: 92, limit: 100 },
  { name: 'Forklift FL-12 Hydraulic Seal', wear: 68, limit: 100 },
  { name: 'Zone C Scanner Calibration', wear: 35, limit: 100 },
  { name: 'Sorting Station C Belts', wear: 62, limit: 100 },
  { name: 'Loading Dock Gate Actuator', wear: 24, limit: 100 },
];

export const Analytics: React.FC = () => {
  const [forecastRange, setForecastRange] = useState<3 | 6 | 12>(6);

  const currentChartData = analyticsMockData[forecastRange];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dynamic Forecast Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 font-sans">
            <ChartIcon className="w-4 h-4 text-violet-400" /> Operational Predictive Modeler
          </h3>
          <p className="text-[10px] text-slate-500 font-sans mt-0.5">Adjust timeline options to simulate warehouse equipment wear projections and throughput limits</p>
        </div>

        <div className="flex gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start">
          {([3, 6, 12] as const).map((range) => (
            <button
              key={range}
              onClick={() => setForecastRange(range)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                forecastRange === range
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range} Months
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart Area */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 lg:col-span-2 bg-slate-900/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Vibration & Throughput Load Forecast</h4>
              <p className="text-[9px] text-slate-400 font-sans">Historical metrics vs simulated regression curve</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-emerald-500 rounded-sm"></span> Historical</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-violet-400 rounded-sm"></span> Forecasted</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#f1f5f9', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="historical" stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981' }} connectNulls={false} />
                <Line type="monotone" dataKey="projected" stroke="#8B5CF6" strokeWidth={2.5} strokeDasharray="5 5" dot={{ fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wear metrics list */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Asset Stress Levels</h4>
            <p className="text-[9px] text-slate-400 font-sans">Remaining lifespan/accuracy warning indicators</p>
          </div>

          <div className="space-y-3.5">
            {wearDistribution.map((item) => {
              const isHigh = item.wear > 75;
              
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-sans font-medium">
                    <span className="text-slate-300">{item.name}</span>
                    <span className={`font-mono font-bold ${isHigh ? 'text-rose-400' : 'text-slate-400'}`}>{item.wear}%</span>
                  </div>
                  <div className="w-full bg-slate-950 border border-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isHigh ? 'bg-rose-500' : 'bg-violet-500'
                      }`}
                      style={{ width: `${item.wear}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analytical Breakdown Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-900/40 text-emerald-450">
            <Percent className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans">Overall Health Factor</span>
            <h4 className="text-xl font-bold text-slate-205 mt-0.5 font-sans">94.8%</h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-900/40 text-amber-450">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans">Subsystem Alerts Risk</span>
            <h4 className="text-xl font-bold text-slate-205 mt-0.5 font-sans">Moderate</h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans">Database Query Rate</span>
            <h4 className="text-xl font-bold text-slate-205 mt-0.5 font-sans">184 ms</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
