//"use client";
// components/ReportingComponent.tsx
//import { useState, useEffect } from 'react';
//import * as fs from 'node:fs';
import * as path from 'path';
import React from 'react';
//import React, { useState } from "react";
import { fetchPerfData } from '@/lib/filesystem/collect_perf_files';
//import * as tar from 'tar';
//import * as zlib from 'zlib';

//export async function getServerSideProps(context) {

//}

interface ProcessedData {
  //directory: string;
  functionSequences: string[][];
}

interface FunctionSums {
  [key: string]: {
    total: number;
    count: number;
    min: number;
    max: number;
  };
}

const processProfile = (profile: any, start: number): any => {
  // implementation...
};

// Interfaces for the CPU profile structure
interface CallFrame {
  functionName: string;
  scriptId: string;
  url: string;
  lineNumber: number;
  columnNumber: number;
}

interface ProfileNode {
  id: number;
  callFrame: CallFrame;
  hitCount: number;
  children?: number[];
}

interface CPUProfile {
  nodes: ProfileNode[];
  startTime: number;
  endTime: number;
  samples: number[];
  timeDeltas?: number[];
}

// Props for the TreeNode component
interface TreeNodeProps {
  node: ProfileNode;
  childrenMap: Map<number, ProfileNode[]>;
}

// TreeNode component: Recursively renders nodes
const TreeNode: React.FC<TreeNodeProps> = ({ node, childrenMap }) => {
  //const [expanded, setExpanded] = useState(false);

  const children = childrenMap.get(node.id) || [];
  const expanded = true;
  return (
    <div style={{ marginLeft: 20 }}>
      <div  style={{ cursor: "pointer" }}>
        {children.length > 0 ? (expanded ? "▼ " : "▶ ") : "• "}
        <strong>{node.callFrame.functionName || "(anonymous)"}</strong>{" "}
        (hitCount: {node.hitCount})
      </div>
      {expanded && (
        <div>
          {children.map((child) => (
            <TreeNode key={child.id} node={child} childrenMap={childrenMap} />
          ))}
        </div>
      )}
    </div>
  );
};

// CPUProfileTree component: Renders the entire tree
const CPUProfileTree: React.FC<{ profile: CPUProfile }> = ({ profile }) => {
  // Build a map of node ID to its children for easy lookup
  const childrenMap = new Map<number, ProfileNode[]>();
  profile.nodes.forEach((node) => {
    if (node.children) {
      node.children.forEach((childId) => {
        if (!childrenMap.has(node.id)) {
          childrenMap.set(node.id, []);
        }
        const childNode = profile.nodes.find((n) => n.id === childId);
        if (childNode) {
          childrenMap.get(node.id)!.push(childNode);
        }
      });
    }
  });

  // Find the root nodes (nodes with no parents)
  const rootNodes = profile.nodes.filter(
    (node) =>
      !profile.nodes.some((parentNode) =>
        parentNode.children?.includes(node.id)
      )
  );

  return (
    <div>
      <h1>CPU Profile Tree</h1>
      <p>
        Profile Duration: {(profile.endTime - profile.startTime) / 1000} ms
      </p>
      <div>
        {rootNodes.map((rootNode) => (
          <TreeNode
            key={rootNode.id}
            node={rootNode}
            childrenMap={childrenMap}
          />
        ))}
      </div>
    </div>
  );
};



export default async function ReportingComponent(){
  //  const [functionSums, setFunctionSums] = useState<FunctionSums>({});
  //  const [functionSums2, setFunctionSums2] = useState<FunctionSums>({});
  const functionSums2:FunctionSums = {};
  //  const [results, setResults] = useState<ProcessedData[]>([]);
  const results:ProcessedData[] = [];

  const perfdata = await fetchPerfData();
  //console.log(perfdata);
  
  // //  useEffect(() => {
  //   const rootDirectory = './data2/';
  // async  function processPerfData (){      
  //   const functionSequences = [] //await processTarGz(perfDataPath);
  //   for (let functionName in functionSums) {
  //     let total = functionSums[functionName];
  //     if (functionSums2[functionName]) {
  //       functionSums2[functionName].total += total.total;
  //       functionSums2[functionName].count += total.count;
  //       functionSums2[functionName].min = Math.min(functionSums2[functionName].min, total.total);
  //       functionSums2[functionName].max = Math.max(functionSums2[functionName].max, total.total);
  //     } else {
  //       functionSums2[functionName] = {
  //         count: total.count,
  //         total: total.total,
  //         min: total.min,
  //         max: total.max,
  //       };
  //     }
  //   }
  //   results.push({
  //     //directory: subdir,
  //     functionSequences,
  //   });
  // }
  // setResults(results);      
  // for (let functionName in functionSums2) {
  //   console.log("sum", functionName, functionSums2[functionName]);
  // }
  //});
  //processPerfData();
  function foo(a){
    //console.log(a);
    const key = a.pathName;
    return (
      <li key={key}>{key}
	      <CPUProfileTree profile={a.profileData}></CPUProfileTree>
	    </li>)    
    }
    
  return (
    <div>
      <h1>Reporting Component</h1>
      <ul key="files">
	{
	  perfdata.map(foo)
	}
      </ul>
      <p>Function Sums:</p>
      <ul key="sum">
        {Object.keys(functionSums2).map((functionName, index) => (
          <li key={index}>
            {functionName}: {JSON.stringify(functionSums2[functionName])}
          </li>
        ))}
      </ul>
      <p>Results:</p>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <p>Directory: {"result.directory"}</p>
            <p>Function Sequences:</p>
            <ul>
              {result.functionSequences.map((sequence, index) => (
                <li key={index}>
                  Sequence {index + 1}: {sequence.join(' -> ')}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};


