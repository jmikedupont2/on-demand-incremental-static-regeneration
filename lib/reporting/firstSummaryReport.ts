interface ProcessedData {
  directory?: string;
  functionSequences: string[][];
}

let functionSums: { [key: string]: { total: number, count: number, min: number, max: number} } = {};
let functionSums2: { [key: string]: { total: number, count: number, min: number, max: number} } = {};

async function processPerfData(functionSequences): Promise<ProcessedData[]> {
   const results: ProcessedData[] = [];
  //const functionSequences = await processTarGz(perfDataPath);
    for (let functionName in functionSums) {
      //console.log("report1",perfDataPath,functionName, functionSums[functionName]);
      let total = functionSums[functionName];
      if (functionSums2[functionName]) {
        functionSums2[functionName].total += total.total;
        functionSums2[functionName].count += total.count;
        functionSums2[functionName].min = Math.min(functionSums2[functionName].min, total.total);
        functionSums2[functionName].max = Math.max(functionSums2[functionName].max, total.total);
      }
      else {
        functionSums2[functionName] = {
          count : total.count,
          total: total.total,
          min: total.min,
          max: total.max,
        }
      }
    }     
    functionSums= {}; // reset    
    results.push({
      //directory: subdir,
      functionSequences
    });
  return results;
}

export function processProfile(profile:any, start:number): any {
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
    if (node.children) {
      for (const child of node.children) {

	let  res = processProfile(profile, child);
	total.total += res.total;
	total.count += res.count;	
	total.min = Math.min(total.min, res.min);
	total.max = Math.max(total.max, res.max); 
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
  return total;
}

export function adaptor(){


}