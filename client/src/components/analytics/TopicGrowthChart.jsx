import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const { solved, total, allTimeSolved } = payload[0].payload;
  return (
    <div className="rounded-lg border border-surface-700 bg-surface-800 px-4 py-3 shadow-lg">
      <p className="text-sm font-medium text-surface-100">{label}</p>
      <p className="text-sm text-surface-300">Last 30 days: +{solved}</p>
      {allTimeSolved !== undefined && (
        <p className="text-sm text-surface-300">Total solved: {allTimeSolved}{total ? ` / ${total}` : ''}</p>
      )}
    </div>
  );
}

export default function TopicGrowthChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-surface-400">
        No recent topic growth data yet
      </div>
    );
  }

  const chartData = [...data]
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={chartData.length * 50 + 40}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="topic"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          width={140}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="solved" fill="#34d399" radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
