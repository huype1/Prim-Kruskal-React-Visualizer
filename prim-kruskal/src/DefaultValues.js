export const initialNodes = [
  {
    id: "A",
    position: { x: 0, y: 100 },
    data: { label: "A" },
    type: "customNode",
  },
  {
    id: "B",
    position: { x: 100, y: 0 },
    data: { label: "B" },
    type: "customNode",
  },
  {
    id: "C",
    position: { x: 200, y: 0 },
    data: { label: "C" },
    type: "customNode",
  },
  {
    id: "D",
    position: { x: 100, y: 200 },
    data: { label: "D" },
    type: "customNode",
  },
  {
    id: "E",
    position: { x: 200, y: 200 },
    data: { label: "E" },
    type: "customNode",
  },
  {
    id: "F",
    position: { x: 300, y: 100 },
    data: { label: "F" },
    type: "customNode",
  },
];

export const initialEdges = [
  { id: "AB", source: "A", target: "B", label: "10", type: "customEdge" },
  { id: "AD", source: "A", target: "D", label: "4", type: "customEdge" },
  { id: "BC", source: "B", target: "C", label: "8", type: "customEdge" },
  { id: "BD", source: "B", target: "D", label: "2", type: "customEdge" },
  { id: "BE", source: "B", target: "E", label: "6", type: "customEdge" },
  { id: "CE", source: "C", target: "E", label: "1", type: "customEdge" },
  { id: "CF", source: "C", target: "F", label: "5", type: "customEdge" },
  { id: "DE", source: "D", target: "E", label: "6", type: "customEdge" },
  { id: "EF", source: "E", target: "F", label: "12", type: "customEdge" },
  { id: "EX", source: "E", target: "X", label: "10", type: "customEdge" },
];