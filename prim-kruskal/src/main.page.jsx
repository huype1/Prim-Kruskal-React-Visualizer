import React, {useEffect, useState, useRef, useCallback, useMemo} from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import "reactflow/dist/style.css";
import {useI18n} from "./utils/i18n";
import {initialNodes, initialEdges} from "./DefaultValues.js";
import {nodeTypes, edgeTypes} from "./GraphComponents.jsx";
import {Dijkstra} from "./dijsktra.js";

const GraphVisualisation = () => {
  const [matrix, setMatrix] = useState([]);

  const defaultEdgeStyle = useMemo(
    () => ({
      stroke: "#999",
      strokeWidth: 2,
    }),
    []
  );

  const initializeEdges = (edges) => {
    return edges.map((edge) => ({...edge, style: {...defaultEdgeStyle}}));
  };
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initializeEdges(initialEdges));

  const {t} = useI18n();
  const flowRef = useRef(null);
  const [startNode, setStartNode] = useState("");
  const [result, setResult] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const updateEdgeStyles = (path, edges) => {
    const pathEdges = new Set();
    for (let i = 1; i < path.length; i++) {
      console.log(path[i], "to", path[i - 1]);
      pathEdges.add(`${path[i - 1]}-${path[i]}`);
      pathEdges.add(`${path[i]}-${path[i - 1]}`);
    }

    // Update the styles of the edges
    return edges.map((edge) => {
      if (pathEdges.has(`${edge.source}-${edge.target}`)) {
        return {...edge, style: {stroke: "#32CD32", strokeWidth: 3}};
      }
      return edge;
    });
  };

  const calculatePath = (currentNode, parents) => {
    let path = [];
    let node = currentNode;
    while (node !== null) {
      path.push(node);
      node = parents[node];
    }
    return path.reverse(); // reverse the path to get the correct order
  };

  const handleStepForward = () => {
    if (!result || currentStepIndex >= result.steps.length - 1) return;

    setCurrentStepIndex(currentStepIndex + 1);
    const path = calculatePath(result.steps[currentStepIndex + 1].currentNode, result.parents);
    const updatedEdges = updateEdgeStyles(path, edges);
    setEdges(updatedEdges);
  };

  useEffect(() => {
    if (!result || !isAutoPlay) return;

    const intervalId = setInterval(() => {
      if (currentStepIndex < result.steps.length - 1) {
        handleStepForward();
      } else {
        setIsAutoPlay(false);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStepIndex, result, isAutoPlay]);

  const updateMatrix = (nodes, edges) => {
    const size = nodes.length;
    const newMatrix = Array(size + 1)
      .fill(null)
      .map(() => Array(size + 1).fill("Inf"));

    for (let i = 1; i <= size; i++) {
      newMatrix[0][i] = nodes[i - 1].data.label;
      newMatrix[i][0] = nodes[i - 1].data.label;
    }

    edges.forEach((edge) => {
      const sourceIndex = nodes.findIndex((n) => n.id === edge.source) + 1;
      const targetIndex = nodes.findIndex((n) => n.id === edge.target) + 1;
      if (sourceIndex && targetIndex) {
        newMatrix[sourceIndex][targetIndex] = edge.label;
        newMatrix[targetIndex][sourceIndex] = edge.label; // 因为是无向图
      }
    });

    setMatrix(newMatrix);
  };
  useEffect(() => {
    updateMatrix(nodes, edges);
    if (startNode === "") {
      setStartNode(nodes[0].data.label); // set the first node as the default node
    }
  }, [nodes, edges, startNode]);

  const handleStartNodeChange = (event) => {
    setResult(null);
    setCurrentStepIndex(0);
    setStartNode(event.target.value);
    setEdges(resetEdgeStyles(edges));
  };

  const handleCalculate = () => {
    //set algorithm here
    const graph = new Dijkstra(matrix);
    setResult(null);
    setCurrentStepIndex(0);
    setEdges(resetEdgeStyles(edges));
    const result = graph.findShortestPath(startNode);
    setResult(result);
    setIsAutoPlay(false);
  };

  const resetEdgeStyles = useCallback(
    (edges) => {
      return edges.map((edge) => ({...edge, style: defaultEdgeStyle}));
    },
    [defaultEdgeStyle]
  );

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((ns) => applyNodeChanges(changes, ns));
      if (changes.some((change) => change.type === "remove")) {
        setEdges(resetEdgeStyles(edges));
        setResult(null);
        setCurrentStepIndex(0);
      }
    },
    [setNodes, edges, setEdges, resetEdgeStyles]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      if (changes.some((change) => change.type === "remove")) {
        setEdges((es) => {
          const updatedEdges = applyEdgeChanges(changes, es);
          return resetEdgeStyles(updatedEdges);
        });
        setResult(null);
        setCurrentStepIndex(0);
      }
    },
    [resetEdgeStyles, setEdges]
  );

  return (
    <div className="flex w-full h-full overflow-auto">
      <div className="w-3/5 h-full relative">
        <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
          <div className="flex items-center">
            <label htmlFor="startNodeSelect" className="mr-2 flex-none">
              {t("select_start")}
            </label>
            <select value={startNode} onChange={handleStartNodeChange} className="px-4 py-2 mr-2 rounded-md w-full">
              {matrix[0] &&
                matrix[0].slice(1).map((node) => (
                  <option key={node} value={node}>
                    {" "}
                    {node}{" "}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCalculate}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none transition-colors duration-200"
            >
              {t("find_path")}
            </button>
            {result && (
              <>
                <button
                  onClick={handleStepForward}
                  disabled={currentStepIndex >= result.steps.length - 1 || isAutoPlay}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("next_step")}
                </button>
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  disabled={currentStepIndex >= result.steps.length - 1}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAutoPlay ? t("pause") : t("auto_play")}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="h-[calc(100vh-20rem)] w-full min-h-[50rem]">
          <ReactFlow
            ref={flowRef}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            style={{width: "100%", height: "100%"}}
          >
            <Controls/>
            <MiniMap/>
            <Background variant="dots" gap={12} size={1}/>
          </ReactFlow>
        </div>
      </div>
      <div className="w-2/5 p-5 overflow-auto">
        <h2 className="text-2xl pb-5">{t("weight_matrix")}</h2>


      </div>
    </div>
  );
};

export default GraphVisualisation;