import {Position, Handle} from "reactflow";
const CustomNode = ({ data }) => {
  return (
    <div className="relative">
      <div className="bg-pink-500 text-white p-2 rounded-full w-6 h-6 flex justify-center items-center text-sm font-bold">
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
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path stroke-current text-gray-500" d={edgePath} />
      <text className="text-xs">
        <textPath href={`#${id}`} className="text-gray-700" startOffset="50%" textAnchor="middle">
          {label}
        </textPath>
      </text>
    </>
  );
};

export const edgeTypes = {
  customEdge: CustomEdge,
};
