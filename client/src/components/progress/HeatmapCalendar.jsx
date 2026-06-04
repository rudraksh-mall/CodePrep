import { useState, useMemo } from 'react';

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensity(count) {
  if (!count || count === 0) return 'bg-surface-800';
  if (count === 1) return 'bg-emerald-900';
  if (count <= 3) return 'bg-emerald-600';
  return 'bg-emerald-400';
}

function buildGrid(data, days = 365) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const start = new Date(today);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  const lookup = {};
  data.forEach((d) => { lookup[d.date] = d.count; });

  const startDay = start.getDay();
  const cols = Math.ceil((days + startDay) / 7);

  const cells = [];
  const monthLabels = [];

  for (let col = 0; col < cols; col++) {
    let monthLabel = null;

    for (let row = 0; row < 7; row++) {
      const dayOffset = col * 7 + row - startDay;
      const d = new Date(start);
      d.setDate(d.getDate() + dayOffset);

      if (d > today || d < start) {
        cells.push(null);
        continue;
      }

      const dateStr = d.toISOString().slice(0, 10);
      const count = lookup[dateStr] || 0;
      cells.push({ date: dateStr, count, row, col });

      if (d.getDate() === 1 && !monthLabel) {
        monthLabel = { label: MONTHS[d.getMonth()], col };
      }
    }

    if (monthLabel) monthLabels.push(monthLabel);
  }

  monthLabels.sort((a, b) => a.col - b.col);

  return { cells, monthLabels, cols };
}

export default function HeatmapCalendar({ data = [], days = 365 }) {
  const [tooltip, setTooltip] = useState(null);

  const { cells, monthLabels, cols } = useMemo(() => buildGrid(data, days), [data, days]);

  return (
    <div className="relative">
      <div className="flex gap-1">
        <div className="flex flex-col justify-between pr-2 pt-5 text-xs text-surface-400 leading-[14px]">
          {DAY_LABELS.map((l, i) => (
            <span key={i} className="h-[14px]">{l}</span>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="relative">
            <div className="flex gap-[2px] pl-0 mb-[2px] h-4 text-xs text-surface-400">
              {monthLabels.map((m) => (
                <span
                  key={m.col}
                  className="absolute text-xs text-surface-400"
                  style={{ left: `${m.col * 16}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div
              className="grid gap-[2px]"
              style={{ gridTemplateColumns: `repeat(${cols}, 12px)`, gridTemplateRows: 'repeat(7, 12px)' }}
            >
              {cells.map((cell, i) => {
                if (!cell) return <div key={i} />;

                return (
                  <div
                    key={i}
                    className={`relative rounded-sm cursor-pointer ${getIntensity(cell.count)}`}
                    onMouseEnter={(e) => {
                      const rect = e.target.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
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

      <div className="flex items-center justify-end gap-1 mt-2 text-xs text-surface-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-surface-800" />
        <div className="w-3 h-3 rounded-sm bg-emerald-900" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        <span>More</span>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs text-white bg-surface-700 rounded shadow-lg -translate-x-1/2 pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.count} problem{tooltip.count !== 1 ? 's' : ''} on {tooltip.date}
        </div>
      )}
    </div>
  );
}
