export type ElementType =
  | "columns"
  | "walls"
  | "beams"
  | "roofSlabs"
  | "parapet"
  | "staircaseWalls"
  | "staircaseFlights"
  | "floors";

export type ElementStatus = "A" | "B" | "C";

export interface FloorElement {
  completed: number;
  total: number;
  status: ElementStatus;
}

export interface StructuralElement {
  type: ElementType;
  total: number;
  completed: number;
  remaining: number;
  percentage: number;
  status: ElementStatus;
  floorElements?: {
    [floorNumber: number]: FloorElement;
  };
}

export interface Project {
  clientName: string;
  id: string;
  name: string;
  totalDrawings: number;
  submittedDrawings: number;
  status: "A" | "B" | "C";
  progress: number;
  lastUpdated: string;
  elements: StructuralElement[];
}
