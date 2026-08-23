import { ChevronDown } from 'lucide-react';
import Card from '@/components/ui/Card';

const DEFAULT_CHART_HEIGHT = 240;
const CHART_PAD = { top: 16, right: 12, bottom: 32, left: 44 };

const BarChartCard = ({
  title,
  series = [],
  labels = [],
  yTicks = [],
  yMax,
  yearOptions = ['This year'],
  yearValue = 'This year',
  onYearChange,
  chartHeight = DEFAULT_CHART_HEIGHT,
  legendPosition = 'top',
  fullWidth = false,
  className = '',
}) => {
  const width = fullWidth ? Math.max(840, labels.length * 72) : 520;
  const height = chartHeight;
  const pad =
    height <= 180
      ? { top: 10, right: 12, bottom: 26, left: 40 }
      : CHART_PAD;
  const max = yMax || Math.max(...series.flatMap((item) => item.values), 1);
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const groupCount = labels.length || 1;
  const groupWidth = innerW / groupCount;
  const barGap = 4;
  const barWidth = Math.min(fullWidth ? 20 : 14, (groupWidth - barGap * (series.length + 1)) / series.length);

  const legend = (
    <div
      className={`flex flex-wrap justify-center gap-x-6 gap-y-2 px-4 sm:px-5 ${
        legendPosition === 'bottom' ? 'pb-3 pt-2' : 'pb-0 pt-4'
      }`}
    >
      {series.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          <span className="text-[12px] font-medium text-[#64748B] sm:text-[13px]">{item.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div
        className={`flex flex-wrap items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 sm:px-5 ${
          height <= 180 ? 'py-3' : 'py-4'
        }`}
      >
        <h3 className="text-[16px] font-bold text-deep-blue sm:text-[17px]">{title}</h3>
        {yearOptions.length > 0 ? (
          <label className="relative inline-flex min-w-[120px] items-center">
            <select
              value={yearValue}
              onChange={(event) => onYearChange?.(event.target.value)}
              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#E4E7EC] bg-white py-1.5 pl-3 pr-8 text-[13px] font-medium text-deep-blue outline-none focus:border-primary"
              aria-label="Chart period"
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-[#64748B]" />
          </label>
        ) : null}
      </div>

      {legendPosition === 'top' ? legend : null}

      <div
        className={
          fullWidth
            ? `overflow-x-auto px-4 lg:overflow-x-visible sm:px-5 ${height <= 180 ? 'pb-2 pt-1' : 'pb-4 pt-2'}`
            : `overflow-x-auto px-2 sm:px-3 ${height <= 180 ? 'pb-2 pt-1' : 'pb-4 pt-2'}`
        }
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={
            fullWidth
              ? 'block h-[220px] w-full min-w-[720px] lg:h-auto lg:min-w-0'
              : 'min-w-[480px] w-full'
          }
          style={!fullWidth && height <= 180 ? { height: `${height}px` } : undefined}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          {yTicks.map((tick) => {
            const y = pad.top + innerH - (tick / max) * innerH;
            return (
              <g key={tick}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={width - pad.right}
                  y2={y}
                  stroke="#E4E7EC"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={pad.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#98A2B3] text-[10px]"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {labels.map((label, groupIndex) => {
            const groupX = pad.left + groupIndex * groupWidth + groupWidth / 2;
            const totalBarsWidth = series.length * barWidth + (series.length - 1) * barGap;
            let barOffset = -totalBarsWidth / 2;

            return (
              <g key={label}>
                {series.map((item) => {
                  const value = item.values[groupIndex] ?? 0;
                  const barHeight = (value / max) * innerH;
                  const x = groupX + barOffset;
                  const y = pad.top + innerH - barHeight;
                  barOffset += barWidth + barGap;

                  return (
                    <rect
                      key={item.id}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={2}
                      fill={item.color}
                    />
                  );
                })}
                <text
                  x={groupX}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-[#98A2B3] text-[10px]"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {legendPosition === 'bottom' ? legend : null}
    </Card>
  );
};

export default BarChartCard;
