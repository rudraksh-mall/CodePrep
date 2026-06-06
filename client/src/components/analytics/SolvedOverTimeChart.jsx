import { useState, useMemo } from 'react';
import { LineChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const VIEWS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-surface-700 bg-surface-800 px-4 py-3 shadow-lg">
      <p className="text-sm text-surface-400">{label}</p>
      <p className="text-sm font-medium text-surface-100">
        {payload[0].value} problem{payload[0].value !== 1 ? 's' : ''} solved
      </p>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildCumulative(data, view) {
  if (!data || data.length === 0) return [];

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  if (view === 'daily') {
    let cumulative = 0;
    return sorted.map((d) => {
      cumulative += d.count;
      return { date: d.date, displayDate: formatDate(d.date), count: cumulative };
    });
  }

  if (view === 'weekly') {
    const weeks = {};
    for (const d of sorted) {
      const date = new Date(d.date + 'T00:00:00');
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      const key = weekStart.toISOString().slice(0, 10);
      weeks[key] = (weeks[key] || 0) + d.count;
    }
    const weekKeys = Object.keys(weeks).sort();
    let cumulative = 0;
    return weekKeys.map((key) => {
      cumulative += weeks[key];
      const label = `W${Math.ceil(parseInt(key.slice(8)) / 7)} ${key.slice(0, 4)}`;
      return { date: key, displayDate: label, count: cumulative };
    });
  }

  if (view === 'monthly') {
    const months = {};
    for (const d of sorted) {
      const monthKey = d.date.slice(0, 7);
      months[monthKey] = (months[monthKey] || 0) + d.count;
    }
    const monthKeys = Object.keys(months).sort();
    let cumulative = 0;
    return monthKeys.map((key) => {
      cumulative += months[key];
      const [y, m] = key.split('-');
      const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return { date: key, displayDate: label, count: cumulative };
    });
  }

  return [];
}

export default function SolvedOverTimeChart({ data = [] }) {
  const [view, setView] = useState('daily');

  const chartData = useMemo(() => buildCumulative(data, view), [data, view]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-surface-400">
        No activity data yet
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              view === v.key
                ? 'bg-primary-600 text-white'
                : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="displayDate"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="count" fill="url(#solvedGradient)" stroke="none" />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#818cf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#818cf8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
