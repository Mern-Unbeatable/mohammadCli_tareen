import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import Card from '@/components/ui/Card';

const CHART_HEIGHT = 220;
const CHART_PAD = { top: 16, right: 12, bottom: 28, left: 44 };

function buildPath(values, width, height, max) {
  if (!values.length) return '';
  const innerW = width - CHART_PAD.left - CHART_PAD.right;
  const innerH = height - CHART_PAD.top - CHART_PAD.bottom;
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = CHART_PAD.left + index * step;
      const y = CHART_PAD.top + innerH - (value / max) * innerH;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

const LineChartCard = ({
  title,
  series = [],
  labels = [],
  yTicks = [],
  yMax,
  yearOptions = ['This year'],
  yearValue = 'This year',
  onYearChange,
  className = '',
}) => {
  const gradientId = useId().replace(/:/g, '');
  const width = 520;
  const height = CHART_HEIGHT;
  const max = yMax || Math.max(...series.flatMap((item) => item.values), 1);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 py-4 sm:px-5">
        <h3 className="text-[16px] font-bold text-deep-blue">{title}</h3>
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

      <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 pt-4 sm:px-5">
        {series.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="text-[12px] font-medium text-[#64748B]">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto px-2 pb-4 pt-2 sm:px-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[480px] w-full"
          role="img"
          aria-label={title}
        >
          {yTicks.map((tick) => {
            const innerH = height - CHART_PAD.top - CHART_PAD.bottom;
            const y = CHART_PAD.top + innerH - (tick / max) * innerH;
            return (
              <g key={tick}>
                <line
                  x1={CHART_PAD.left}
                  y1={y}
                  x2={width - CHART_PAD.right}
                  y2={y}
                  stroke="#E4E7EC"
                  strokeWidth="1"
                />
                <text
                  x={CHART_PAD.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#98A2B3] text-[10px]"
                >
                  {tick >= 1000 ? `${tick / 1000}k` : tick}
                </text>
              </g>
            );
          })}

          {series.map((item) => (
            <path
              key={item.id}
              d={buildPath(item.values, width, height, max)}
              fill="none"
              stroke={item.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {labels.map((label, index) => {
            const innerW = width - CHART_PAD.left - CHART_PAD.right;
            const step = labels.length > 1 ? innerW / (labels.length - 1) : 0;
            const x = CHART_PAD.left + index * step;
            return (
              <text
                key={label}
                x={x}
                y={height - 6}
                textAnchor="middle"
                className="fill-[#98A2B3] text-[10px]"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </Card>
  );
};

export default LineChartCard;
