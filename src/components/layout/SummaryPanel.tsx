import type { Table } from "../../types/types";

type Props = {
  tables: Table[];
};

export default function SummaryPanel({ tables }: Props) {
  const summary = (() => {
    const groups: Record<string, { count: number; totalStatus: number }> = {};
    for (const t of tables) {
      if (!groups[t.type]) groups[t.type] = { count: 0, totalStatus: 0 };
      groups[t.type].count++;
      groups[t.type].totalStatus += t.status;
    }
    return groups;
  })();

  return (
    <div className="p-3 bg-white border rounded shadow w-80 self-center">
      <h4 className="font-bold mb-2">Összesítő</h4>

      <p className="text-sm mb-3">
        <strong>{tables.length}</strong> asztal összesen
      </p>

      <ul className="text-sm space-y-1">
        {Object.entries(summary).map(([type, data]) => {
          const avg = (data.totalStatus / data.count).toFixed(1);
          return (
            <li key={type} className="flex justify-between">
              <span className="capitalize">{type}</span>
              <span>
                {data.count} db &nbsp; ⌀ {avg}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
