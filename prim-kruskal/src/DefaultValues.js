export const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 100 },
    data: { label: "1" },
    type: "customNode",
  },
  {
    id: "2",
    position: { x: 100, y: 0 },
    data: { label: "2" },
    type: "customNode",
  },
  {
    id: "3",
    position: { x: 200, y: 0 },
    data: { label: "3" },
    type: "customNode",
  },
  {
    id: "4",
    position: { x: 100, y: 200 },
    data: { label: "4" },
    type: "customNode",
  },
  {
    id: "5",
    position: { x: 200, y: 200 },
    data: { label: "5" },
    type: "customNode",
  },
  {
    id: "6",
    position: { x: 300, y: 100 },
    data: { label: "6" },
    type: "customNode",
  },
];

export const initialEdges = [
  { id: "12", source: "1", target: "2", label: "10", type: "customEdge" },
  { id: "14", source: "1", target: "4", label: "4", type: "customEdge" },
  { id: "23", source: "2", target: "3", label: "8", type: "customEdge" },
  { id: "24", source: "2", target: "4", label: "2", type: "customEdge" },
  { id: "25", source: "2", target: "5", label: "6", type: "customEdge" },
  { id: "35", source: "3", target: "5", label: "1", type: "customEdge" },
  { id: "36", source: "3", target: "6", label: "5", type: "customEdge" },
  { id: "45", source: "4", target: "5", label: "6", type: "customEdge" },
  { id: "56", source: "5", target: "6", label: "12", type: "customEdge" },
];