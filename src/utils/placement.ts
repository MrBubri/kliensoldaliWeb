import type { Table } from "../types/types";

export function getTableSize(type: string) {
  switch (type) {
    case "snooker":
      return { width: 190, height: 100, clearance: 50 };
    case "air-hockey":
      return { width: 140, height: 70, clearance: 40 };
    case "foosball":
      return { width: 120, height: 60, clearance: 30 };
    default:
      return { width: 120, height: 60, clearance: 30 };
  }
}

export function canPlaceTableAt(
  newTable: Table,
  pos: { x: number; y: number },
  tables: Table[],
  roomSize: { width: number; height: number },
) {
  const { width, height, clearance } = getTableSize(newTable.type);

  if (pos.x - clearance < 0) return false;
  if (pos.y - clearance < 0) return false;
  if (pos.x + width + clearance > roomSize.width) return false;
  if (pos.y + height + clearance > roomSize.height) return false;

  for (const t of tables) {
    if (t.id === newTable.id) continue;
    const s = getTableSize(t.type);
    const leftA = pos.x - clearance;
    const rightA = pos.x + width + clearance;
    const topA = pos.y - clearance;
    const bottomA = pos.y + height + clearance;

    const leftB = t.position.x - s.clearance;
    const rightB = t.position.x + s.width + s.clearance;
    const topB = t.position.y - s.clearance;
    const bottomB = t.position.y + s.height + s.clearance;

    const overlapX = !(rightA <= leftB || leftA >= rightB);
    const overlapY = !(bottomA <= topB || topA >= bottomB);

    if (overlapX && overlapY) return false;
  }

  return true;
}
