const generatePositions = (numNodes, width = 800, height = 600) => {
  const positions = [];
  // Dua tren so node tinh ra ban kinh cua do thi voi hinh tron
  const radius = Math.min(width, height) * 0.4;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < numNodes; i++) {
    const angle = (i / numNodes) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    positions.push({x,y});
  }

  return positions;
};
export default generatePositions;