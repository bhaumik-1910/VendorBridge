import Card, { CardHeader } from '../ui/Card';

const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'];

export default function ProcurementHeatmap({ heatmapData = [] }) {
  const maxVal = Math.max(1, ...heatmapData.flatMap((d) => d.hours || []));

  return (
    <Card>
      <CardHeader title="Activity Heatmap" subtitle="Procurement activity by day" />
      {heatmapData.length === 0 ? (
        <p className="text-sm text-foreground-subtle py-4 text-center">No activity data</p>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-8 gap-1 text-[10px] text-foreground-subtle">
            <div />
            {hours.map((h) => <div key={h} className="text-center">{h}</div>)}
          </div>
          {heatmapData.map((row) => (
            <div key={row.day} className="grid grid-cols-8 gap-1 items-center">
              <span className="text-xs text-foreground-subtle">{row.day}</span>
              {(row.hours || []).map((val, i) => {
                const intensity = val / maxVal;
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-sm"
                    style={{ backgroundColor: `rgba(16, 185, 129, ${0.1 + intensity * 0.7})` }}
                    title={`${val} events`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
