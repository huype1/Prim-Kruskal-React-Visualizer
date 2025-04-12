import {Position, Handle} from "reactflow";
const CustomNode = ({ data }) => {
  const bgColor = data.highlight ? "bg-yellow-400" : "bg-blue-500";

  return (
    <div className="relative">
      <div className={`${bgColor} text-white p-2 rounded-full w-6 h-6 flex justify-center items-center text-sm font-bold transition-colors duration-300`}>
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="s-center"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1px",
          height: "1px",
          opacity: 0,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="t-center"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1px",
          height: "1px",
          opacity: 0,
        }}
      />
    </div>
  );
};

export const nodeTypes = {
  customNode: CustomNode,
};

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, label, style = {} }) => {
  // tạo đường dẫn từ source đến target
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  //Tọa độ của weight giữa 2 điểm
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  //khoảng cách trục x
  const dx = targetX - sourceX;
  //khoảng cách trục y
  const dy = targetY - sourceY;
  //cthuc euclide tính độ dài đoạn thẳng
  const length = Math.sqrt(dx * dx + dy * dy);

  // tránh để label trùng nhau
  const offsetX = -dy / length * 10;
  const offsetY = dx / length * 10;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
      />
      {label && (
        <g transform={`translate(${midX + offsetX}, ${midY + offsetY})`}>
          <rect
            x="-10"
            y="-8"
            width={(label.toString().length * 8) + 10}
            height="16"
            fill="white"
            fillOpacity="0.8"
            rx="2"
          />
          <text
            className="text-xs font-medium"
            textAnchor="middle"
            alignmentBaseline="central"
            fill="#666"
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
};

export const edgeTypes = {
  customEdge: CustomEdge,
};