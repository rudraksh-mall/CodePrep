import { LineChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SolvedOverTimeChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-surface-400">
        No activity in the last 30 days
      </div>
    );
  }

  const chartData = data.map((d) => ({ ...d, displayDate: formatDate(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={300}>
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
          width={30}
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
  );
}
