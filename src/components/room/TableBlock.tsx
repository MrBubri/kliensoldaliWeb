import type { Table } from "../../types/types";
import { getTableSize } from "../../utils/placement";

type Props = {
  table: Table;
  isSelected: boolean;
  isConflicting: boolean;
  onSelect: (table: Table) => void;
  onMouseDown: (e: React.MouseEvent, table: Table) => void;
};

export default function TableBlock({
  table,
  isSelected,
  isConflicting,
  onSelect,
  onMouseDown,
}: Props) {
  const size = getTableSize(table.type);
  const opacity = table.status / 10;

  let borderClass = "";
  if (table.category === "competition") borderClass = "border-4 border-black";
  if (table.category === "normal") borderClass = "border-2 border-gray-700";
  if (table.category === "kids")
    borderClass = "border-2 border-dotted border-pink-500";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(table);
      }}
      onMouseDown={(e) => onMouseDown(e, table)}
      className={`absolute text-white flex items-center justify-center rounded cursor-pointer
        ${borderClass}
        ${isSelected && !isConflicting ? "ring-4 ring-blue-500" : ""}
        ${isConflicting ? "ring-4 ring-red-500" : ""}`}
      style={{
        left: table.position.x,
        top: table.position.y,
        width: size.width,
        height: size.height,
        backgroundColor: table.color,
        opacity,
        userSelect: "none",
      }}
    >
      {table.type}
    </div>
  );
}
