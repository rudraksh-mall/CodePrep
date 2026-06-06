import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

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

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const RADIANS = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIANS);
  const y = cy + radius * Math.sin(-midAngle * RADIANS);

  return (
    <text
      x={x}
      y={y}
      fill="#94a3b8"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs"
    >
      {name} {(percent * 100).toFixed(0)}%
    </text>
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

  const totalSolved = chartData.reduce((sum, d) => sum + d.solved, 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {chartData.map((d) => {
          const pct = totalSolved > 0 ? ((d.solved / totalSolved) * 100).toFixed(1) : 0;
          return (
            <div key={d.difficulty} className="rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-3 text-center">
              <p className="text-2xs text-surface-500 dark:text-surface-400">{d.difficulty}</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-100">{d.solved}</p>
              <p className="text-xs text-surface-400">{pct}%</p>
            </div>
          );
        })}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="solved"
            nameKey="difficulty"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry) => (
              <Cell key={entry.difficulty} fill={COLORS[entry.difficulty] || '#64748b'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
