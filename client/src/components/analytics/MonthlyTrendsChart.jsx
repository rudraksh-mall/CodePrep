import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

export default function MonthlyTrendsChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-surface-400">
        No monthly data yet
      </div>
    );
  }

  const chartData = data.map((d) => {
    const [year, month] = d.month.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    return { month: d.month, label, count: d.count };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          interval="preserveStartEnd"
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          width={30}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
