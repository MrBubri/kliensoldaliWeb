export interface Table {
  id: number;
  type: string;
  category: string;
  color: string;
  status: number;
  position: { x: number; y: number };
  "is-locked"?: boolean;
}
