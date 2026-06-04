import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#fb7185' };

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { difficulty, solved, total } = payload[0].payload;
  const pct = total > 0 ? ((solved / total) * 100).toFixed(1) : 0;
  return (
    <div className="rounded-lg border border-surface-700 bg-surface-800 px-4 py-3 shadow-lg">
      <p className="text-sm font-medium text-surface-100">{difficulty}</p>
      <p className="text-sm text-surface-300">{solved} solved{pct > 0 ? ` (${pct}%)` : ''}</p>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className="flex justify-center gap-6 pt-2">
      {payload?.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-surface-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DifficultyPieChart({ data = [] }) {
  const chartData = data.map((d) => ({ ...d, name: d.difficulty }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-surface-400">
        No difficulty data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="solved"
          nameKey="difficulty"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={50}
        >
          {chartData.map((entry) => (
            <Cell key={entry.difficulty} fill={COLORS[entry.difficulty] || '#64748b'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
