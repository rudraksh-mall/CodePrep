import { useState, useMemo } from 'react';

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CELL_SIZE = 12;
const GAP = 2;

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

  // Monday = 0
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

      const dateStr = current.toISOString().split('T')[0];
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

  const { cells, monthLabels, cols } = useMemo(
    () => buildGrid(data, days),
    [data, days]
  );

  return (
    <div className="relative w-full">
      <div className="flex gap-3">
        {/* Day labels */}
        <div className="flex flex-col justify-between pt-5 text-xs text-surface-400">
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              style={{ height: `${CELL_SIZE}px` }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto pb-2">
          <div
            style={{
              width: `${cols * (CELL_SIZE + GAP)}px`,
            }}
          >
            {/* Month Labels */}
            <div className="relative h-5 mb-2">
              {monthLabels.map((month) => (
                <span
                  key={`${month.label}-${month.col}`}
                  className="absolute text-xs text-surface-400"
                  style={{
                    left: `${month.col * (CELL_SIZE + GAP)}px`,
                  }}
                >
                  {month.label}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
                gap: `${GAP}px`,
              }}
            >
              {cells.map((cell, i) => {
                if (!cell) {
                  return (
                    <div
                      key={i}
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      }}
                    />
                  );
                }

                return (
                  <div
                    key={i}
                    className={`rounded-sm cursor-pointer transition-colors ${getIntensity(
                      cell.count
                    )}`}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
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
      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-surface-400">
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
          className="fixed z-50 px-2 py-1 text-xs text-white rounded shadow-lg pointer-events-none bg-surface-700 -translate-x-1/2"
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