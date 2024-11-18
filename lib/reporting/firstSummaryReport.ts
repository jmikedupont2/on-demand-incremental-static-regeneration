import { CPUProfile, Total } from "../profileTypes";

interface ProcessedData {
  directory?: string;
  functionSequences: string[][];
}

let functionSums: { [key: string]: { total: number, count: number, min: number, max: number} } = {};
let functionSums2: { [key: string]: { total: number, count: number, min: number, max: number} } = {};

export function processPerfData(functionSequences): any {
  //  const results: ProcessedData[] = [];
  for (let functionName in functionSums) {
    //console.log("report1",functionName, functionSums[functionName]);
    let total = functionSums[functionName];
    if (functionSums2[functionName]) {
      functionSums2[functionName].total += total.total;
      functionSums2[functionName].count += total.count;
      functionSums2[functionName].min = Math.min(functionSums2[functionName].min, total.total);
      functionSums2[functionName].max = Math.max(functionSums2[functionName].max, total.total);
    }
    else {
      //console.log("add",functionName,total);
      functionSums2[functionName] = {
          count : total.count,
          total: total.total,
          min: total.min,
          max: total.max,
      }
    }
  }
  //functionSums= {}; // reset
  //results.push({
    //directory: subdir,
  // functionSequences
  //});
  return functionSums2;
}

export function processProfile(profile:CPUProfile, start:number, depth:number, depthLimit:number): any {
  if (!profile.nodes) {
    //console.log("error", profile)
    return
  }
  //console.log("Nodes",profile.nodes.length)
  let node = profile.nodes[start];
  let total = {
    total: 0,
    count: 0,
    min: Number.MAX_VALUE,
    max: Number.MIN_VALUE
  };
  if (node) {
    total.total = node.hitCount;
    total.count = 1;
    total.min = node.hitCount;
    total.max = node.hitCount;
    //console.log("Checktotal1",total)
    if (node.children) {
      for (const child of node.children) {
	  //let  res:Total = {            count:1,           total:1,            min:0,            max:0,          };
	  if (depth < depthLimit){
	    const {total:res} = processProfile(profile, child, depth +1,depthLimit);
	    if (res){
	      //console.log("check res", res)
	      total.total += res.total;
	      total.count += res.count;
	      total.min = Math.min(total.min, res.min);
	      total.max = Math.max(total.max, res.max);
	    }
	  }
      }
      //console.log(node.callFrame.functionName,total);
      if (node.callFrame && node.callFrame.functionName) {
      let functionName = node.callFrame.functionName;
      if (functionSums[functionName]) {
	functionSums[functionName].total += total.total;
	functionSums[functionName].count += 1;
	functionSums[functionName].min = Math.min(functionSums[functionName].min, total.total);
	functionSums[functionName].max = Math.max(functionSums[functionName].max, total.total);
      }
      else {
	functionSums[functionName] = {
	  count : total.count,
	  total: total.total,
	  min: total.min,
	  max: total.max,
	}
      }
      }
    }
  }
  return {total, functionSums, functionSums2};
}
