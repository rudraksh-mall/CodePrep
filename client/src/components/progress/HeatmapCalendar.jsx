import { useState, useMemo } from 'react';

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensity(count) {
  if (!count) return 'bg-surface-800';
  if (count === 1) return 'bg-emerald-900';
  if (count <= 3) return 'bg-emerald-600';
  return 'bg-emerald-400';
}

function buildGrid(data, days = 365) {
  const lookup = Object.fromEntries(
    data.map((d) => [d.date, d.count])
  );

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const start = new Date(today);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  // Monday-first alignment
  const startDay = (start.getDay() + 6) % 7;

  const cols = Math.ceil((days + startDay) / 7);

  const cells = [];
  const monthLabels = [];

  let previousMonth = -1;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < 7; row++) {
      const index = col * 7 + row - startDay;

      const current = new Date(start);
      current.setDate(start.getDate() + index);

      if (current < start || current > today) {
        cells.push(null);
        continue;
      }

      const dateStr =
  current.getFullYear() +
  "-" +
  String(current.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(current.getDate()).padStart(2, "0");
      const month = current.getMonth();

      if (month !== previousMonth) {
        monthLabels.push({
          label: MONTHS[month],
          col,
        });
        previousMonth = month;
      }

      cells.push({
        date: dateStr,
        count: lookup[dateStr] || 0,
        row,
        col,
      });
    }
  }

  return { cells, monthLabels, cols };
}

export default function HeatmapCalendar({ data = [], days = 365 }) {
  const [tooltip, setTooltip] = useState(null);

  console.log("HEATMAP DATA:", data);

  const { cells, monthLabels, cols } = useMemo(
    () => buildGrid(data, days),
    [data, days]
  );

  return (
    <div className="relative w-full">
      <div className="flex gap-3">
        {/* Day Labels */}
        <div className="flex flex-col justify-between pt-6 text-xs text-surface-400 shrink-0">
          {DAY_LABELS.map((label, index) => (
            <div key={index} className="h-4 flex items-center">
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="flex-1 overflow-x-auto pb-2">
          <div className="min-w-[650px]">
            {/* Month Labels */}
            <div
              className="grid mb-2 text-xs text-surface-400"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
              }}
            >
              {monthLabels.map((m, i) => {
                const span = (monthLabels[i + 1]?.col ?? cols) - m.col;
                return (
                  <div
                    key={m.col}
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{ gridColumn: `${m.col + 1} / ${m.col + 1 + span}` }}
                  >
                    {m.label}
                  </div>
                );
              })}
            </div>

            {/* Heatmap Grid */}
            <div
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(12px, 1fr))`,
                gridTemplateRows: 'repeat(7, 1fr)',
                gap: '2px',
              }}
            >
              {cells.map((cell, i) => {
                if (!cell) {
                  return (
                    <div
                      key={i}
                      className="aspect-square"
                      style={{
                        gridColumn: (i % cols) + 1,
                      }}
                    />
                  );
                }

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-[2px] cursor-pointer transition-all hover:ring-1 hover:ring-white/30 ${getIntensity(
                      cell.count
                    )}`}
                    style={{
                      gridColumn: cell.col + 1,
                      gridRow: cell.row + 1,
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();

                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 10,
                        date: cell.date,
                        count: cell.count,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-4 text-xs text-surface-400">
        <span>Less</span>

        <div className="w-3 h-3 rounded-sm bg-surface-800" />
        <div className="w-3 h-3 rounded-sm bg-emerald-900" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />

        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs text-white rounded shadow-lg pointer-events-none bg-surface-700 -translate-x-1/2 whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.count} problem
          {tooltip.count !== 1 ? 's' : ''} on {tooltip.date}
        </div>
      )}
    </div>
  );
}