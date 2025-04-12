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
import {Prims} from "./utils/prims.js";
import {Kruskal} from "./utils/kruskal.js";
import generatePositions from "./GenerateNodePosition.js";

const GraphVisualisation = () => {
  const [graphInput, setGraphInput] = useState([]);
  const [edgesInput, setEdgesInput] = useState("");

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
  const [currAlgorithm, setCurrAlgorithm] = useState("Prim's");
  const algorithms = ["Prim's", "Kruskal's"];

  const handleCustomGraph = () => {
    try {
      const lines = edgesInput.trim().split("\n");

      const numNodes = parseInt(lines[0].trim());

      if (isNaN(numNodes) || numNodes <= 0) {
        alert("Dong dau tien can la mot so nguyen");
        return;
      }

      //Tao node moi
      const positions = generatePositions(numNodes);
      const newNodes = Array.from({length: numNodes}, (_, i) => ({
        id: (i + 1).toString(),
        position: positions[i],
        data: {label: (i + 1).toString()},
        type: "customNode",
      }));

      const newEdges = [];

      const startLineIndex = lines.length > 1 && !lines[1].match(/^\s*\d+\s*,/) ? 2 : 1;

      for (let i = startLineIndex; i < lines.length; i++) {
        const parts = lines[i].split(",");
        if (parts.length === 3) {
          const source = parts[0].trim();
          const target = parts[1].trim();
          const weight = parts[2].trim();

          newEdges.push({
            id: `${source}-${target}`,
            source: source,
            target: target,
            label: weight,
            type: "customEdge"
          });
        }
      }

      setNodes(newNodes);
      setEdges(initializeEdges(newEdges));
      setResult(null);
      setCurrentStepIndex(0);
      setStartNode(newNodes[0].data.label);
    } catch (error) {
      alert("Error parsing input: " + error.message);
    }
  };

  const handleChangeAlgorithm = (event) => {
    setCurrAlgorithm(event.target.value);
    setResult(null);
    setCurrentStepIndex(0);
    setEdges(resetEdgeStyles(edges));
  }

  const createAdjacencyList = (nodes, edges) => {
    const adjList = {};
    const nodeLabels = new Set(nodes.map(node => node.data.label));
    // Initialize empty arrays for all nodes
    nodes.forEach(node => {
      adjList[node.data.label] = [];
    });

    // Add edges to the adjacency list
    edges.forEach(edge => {
      const sourceNode = edge.source;
      const targetNode = edge.target;
      const weight = edge.label;

      if (!nodeLabels.has(sourceNode) || !nodeLabels.has(targetNode)) return;
      // For undirected graph, add both directions
      adjList[sourceNode].push({node: targetNode, weight: parseFloat(weight)});
      adjList[targetNode].push({node: sourceNode, weight: parseFloat(weight)});
    });
    return adjList;
  };

  const handleResetToDefault = () => {
    setNodes(initialNodes);
    setEdges(initializeEdges(initialEdges));
    setResult(null);
    setCurrentStepIndex(0);
    setStartNode(initialNodes[0].data.label);
  };

  const updateEdgeStyles = (mstEdges, edges, nodes) => {
    const highlightedEdges = new Set();
    const pathNodes = new Set();

    // Add all nodes in the MST
    mstEdges.forEach(edge => {
      pathNodes.add(edge.source);
      pathNodes.add(edge.target);

      // Add both directions for undirected graph
      highlightedEdges.add(`${edge.source}-${edge.target}`);
      highlightedEdges.add(`${edge.target}-${edge.source}`);
    });

    const updatedEdges = edges.map((edge) => {
      if (highlightedEdges.has(`${edge.source}-${edge.target}`)) {
        return {...edge, style: {stroke: "#32CD32", strokeWidth: 3}};
      }
      return edge;
    });

    const updatedNodes = nodes.map((node) => {
      if (pathNodes.has(node.data.label)) {
        return {
          ...node,
          data: {
            ...node.data,
            highlight: true
          }
        };
      }
      return {
        ...node,
        data: {
          ...node.data,
          highlight: false
        }
      };
    });

    return {updatedEdges, updatedNodes};
  };

  const handleStepForward = () => {
    if (!result || currentStepIndex >= result.steps.length - 1) return;

    setCurrentStepIndex(currentStepIndex + 1);
    const step = result.steps[currentStepIndex + 1];
    const mstEdges = step.mstEdges || [];

    const {updatedEdges, updatedNodes} = updateEdgeStyles(mstEdges, edges, nodes);
    setEdges(updatedEdges);
    setNodes(updatedNodes);
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

  const updateAdjacencyList = (nodes, edges) => {
    const adjList = createAdjacencyList(nodes, edges);
    setGraphInput(adjList);
  };
  useEffect(() => {
    updateAdjacencyList(nodes, edges);
    if (startNode === "" && nodes.length > 0) {
      setStartNode(nodes[0].data.label);
    }
  }, [nodes, edges, startNode]);


  const handleStartNodeChange = (event) => {
    setResult(null);
    setCurrentStepIndex(0);
    setStartNode(event.target.value);
    setEdges(resetEdgeStyles(edges));
  };

  const handleCalculate = () => {
    setResult(null);
    setCurrentStepIndex(0);
    setEdges(resetEdgeStyles(edges));

    let result;
    if (currAlgorithm === "Prim's") {
      const primAlgo = new Prims(graphInput);
      result = primAlgo.findMinimumSpanningTree(startNode);
    } else {
      const kruskalAlgo = new Kruskal(graphInput);
      result = kruskalAlgo.findMinimumSpanningTree();
    }
    console.log(result)

    setResult(result);
    handleStepForward()
    setIsAutoPlay(false);
  };

  const resetEdgeStyles = useCallback(
    (edges) => {
      const resetedEdges = edges.map((edge) => ({...edge, style: defaultEdgeStyle}));

      setNodes(nodes => nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          highlight: false
        }
      })));

      return resetedEdges;
    },
    [defaultEdgeStyle, setNodes]
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
              {t("select_algorithm")}
            </label>
            <select value={currAlgorithm} onChange={handleChangeAlgorithm} className="px-2 py-2 rounded-md w-full">
              {algorithms.map((algoName => (
                <option key={algoName} value={algoName}>
                  {algoName}
                </option>
              )))}
            </select>

            {currAlgorithm === "Prim's" && (<>
                <label htmlFor="startNodeSelect" className="mr-2 flex-none">
                  {t("select_start")}
                </label>
                <select value={startNode} onChange={handleStartNodeChange} className="px-4 py-2 mr-2 rounded-md w-full">
                  {nodes.map((node) => (
                    <option key={node.id} value={node.data.label}>
                      {node.data.label}
                    </option>
                  ))}
                </select>
              </>
            )}

          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCalculate}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none transition-colors duration-200"
            >
              {t("find_mst")}
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
        <h1 className="text-2xl pb-3">{t("weight_list")}</h1>
        {result && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Kết quả</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Bước</th>
                  <th className="border border-gray-300 px-4 py-2">Hướng</th>
                  <th className="border border-gray-300 px-4 py-2">Trọng số</th>
                </tr>
                </thead>
                <tbody>
                {result.steps.slice(1, currentStepIndex + 1).map((step, index) => {
                  const lastAddedEdge = step.mstEdges.length > 0 ?
                    step.mstEdges[step.mstEdges.length - 1] : null;

                  return (
                    <tr key={index} className={index === currentStepIndex - 1 ? "bg-green-100" : ""}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {lastAddedEdge ? `${lastAddedEdge.source} → ${lastAddedEdge.target}` : "None"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {lastAddedEdge ? lastAddedEdge.weight : 0}
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>

            {currentStepIndex === result.steps.length - 1 && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
                <span className="font-semibold">Tổng:</span>
                <span
                  className="ml-2 text-xl font-bold">{result?.mst?.reduce((acc, edge) => acc + edge.weight, 0)}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 mb-4">
          <div className="mb-4">
            <label htmlFor="edgesInput" className="block mb-2">
              Nhập đồ thị:
              <br/>
              Số đỉnh
              <br/>
              Node1, Node2, Weight
            </label>
            <textarea
              id="edgesInput"
              value={edgesInput}
              onChange={(e) => setEdgesInput(e.target.value)}
              rows="10"
              className="w-full p-2 border rounded font-mono"
              placeholder="10&#10;Node1,Node2,Weight&#10;1,2,5&#10;1,3,10&#10;2,3,7"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCustomGraph}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
            >
              {t("add_graph")}
            </button>
            <button
              onClick={handleResetToDefault}
              className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600"
            >
              {t("default_graph")}
            </button>

          </div>
        </div>


      </div>
    </div>
  )
    ;
};

export default GraphVisualisation;

