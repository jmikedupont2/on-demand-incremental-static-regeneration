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


// TreeNode component: Recursively renders nodes

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
	      {
        // <CPUProfileTree profile={a.profileData}></CPUProfileTree>
        }
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


