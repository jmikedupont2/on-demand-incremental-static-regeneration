//"use client";
import * as path from 'path';
import React from 'react';
import { fetchPerfData } from '@/lib/filesystem/collect_perf_files';
import { CPUProfile, DirObj, FunctionSums, ProcessedData } from '@/lib/profileTypes';
import { processPerfData, processProfile } from '@/lib/reporting/firstSummaryReport';

/*
requirements:

1. summarize the stream of profile data by different keys
1.1. extract a set of keys from each record, these can be either grouped into :
columns or rows or values or skip. every key will be accounted for.
1.2. for the columns collect the values for each row creating a vector.
1.3. then book all the columns to a single row.
so result will be a pivot table: row keys, columns, values.
we will create a total row and column.

the first pivot table will be a total with one row and column.
then we will add in the top N features as columns.
then will split those by top M row features.
 */
export default async function ReportingComponent(){
  //  const [functionSums, setFunctionSums] = useState<FunctionSums>({});
  //  const [functionSums2, setFunctionSums2] = useState<FunctionSums>({});
  const functionSums2:FunctionSums = {};
  //  const [results, setResults] = useState<ProcessedData[]>([]);
  const results:ProcessedData[] = [];

  const perfdata:DirObj[] = await fetchPerfData();

  function processProfileMaybe(x:DirObj): any {    
    if (x.profileData)
      {
        let {
          total, 
          functionSums,
          functionSums2,
        } = processProfile(x.profileData, 0, 0, 10000);
        let res = processPerfData(total);
        //console.log("check summary res",res)
	//	console.log("check summary x",x)
	console.log("check summary total",total)
        let data = total;
        data.run = x.run;
        data.repo = x.repo;
        data.owner = x.owner;        
        data.cpuProfile =  x.cpuProfile;
	data.functionProfile = res;
        return data;
      }
  }   
  const sums = perfdata.map(processProfileMaybe);

  console.log("Sums",sums);
  
  //sums.map(emitSum);
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
  <div>Test
	      {
        // <CPUProfileTree profile={a.profileData}></CPUProfileTree>
              }
  </div>
	    </li>)    
    }


  function foo2(a){
    console.log("FOO2",a);
    const key = a.owner + a.repo + a.run;
    return (
      <li key={key}>{key}
  <div>Test
	      {
        JSON.stringify(a)
        // <CPUProfileTree profile={a.profileData}></CPUProfileTree>
              }
  </div>
	    </li>)    
    }

  return (
    <div>
      <h1>Reporting Component</h1>
      <ul key="files">
	{
	  //perfdata.map(foo)
	  sums.map(foo2)
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
