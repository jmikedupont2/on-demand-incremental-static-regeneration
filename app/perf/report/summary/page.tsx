"use client"
import { useState, useEffect } from 'react';

interface Stats {
  total: number;
  count: number;
}

const pivotFunctionStats = (functionStats: FunctionStatsWithGit): PivotTable => {
  const gitUrls = Object.values(functionStats).reduce((acc, gitStats) => {
    Object.keys(gitStats).forEach((gitUrl) => {
      acc[gitUrl] = { count: 1, total: 1 };
    });
    return acc;
  }, {});
  const pivotTable: PivotTable = {};
  Object.keys(functionStats).forEach((functionKey) => {
    pivotTable[functionKey] = {};
    for (let gitUrl in gitUrls) {
      const stats = functionStats[functionKey][gitUrl];
      pivotTable[functionKey][gitUrl] = stats? stats.total : 0;
    }
  });
  return pivotTable;
};

const processRecord = (record: string[], functionSums: FunctionStatsWithGit) => {
  if (record[0] === 'function_name') {
    // Header, do nothing
  } else {
    const fname = record[0];
    const gitUrl = record[1];
    const totalCount = Number(record[2]);
    const rowCount = Number(record[3]);
    const minCount = Number(record[4]);
    const maxCount = Number(record[5]);
    const results: { [key: string]: number } = {};
    results[fname] = 1; // Process the full name
    //const split1 = camelCaseSplit(fname);
    //for (let n in split1) {
    //  results[split1[n]] = 1; // Process its parts
   // }
    for (let name in results) {
      if (!functionSums[name]) {
        functionSums[name] = {};
      }
      if (!functionSums[name][gitUrl]) {
        functionSums[name][gitUrl] = {
          count: Number(rowCount),
          total: Number(totalCount),
        };
      } else {
        functionSums[name][gitUrl].count += rowCount;
        functionSums[name][gitUrl].total += totalCount;
      }
    }
  }
};

function ReportingComponent () {
  const [functionSums, setFunctionSums] = useState<FunctionStatsWithGit>({});
  const [pivotTable, setPivotTable] = useState<PivotTable>({});

  useEffect(() => {
    const rootDirectory = './data2/';
    const csvFiles = ['perf.data.tar.gz.csv']; // Replace with actual CSV file names
    const promises = []
    //csvFiles.map((csvFile) =>
    //  processCsv(`${rootDirectory}${csvFile}`, functionSums)
    //);

    Promise.all(promises).then(() => {
      setFunctionSums(functionSums);
      const pivotTable = pivotFunctionStats(functionSums);
      setPivotTable(pivotTable);
      //writePivotTableToCsv(pivotTable, 'pivot_table.csv');
    });
  }, []);

  return (
    <div>
      <h1>Reporting Component</h1>
      <p>Function Sums: {Object.keys(functionSums).length}</p>
    </div>)
}

interface FunctionStatsWithGit {
  [key: string]: {
    [gitUrl: string]: {
      total: number;
      count: number;
    };
  };
}

interface PivotTable {
  [functionKey: string]: {
    [gitUrl: string]: number;
  };
}

const ReportingComponent2 = () => {
  const [functionSums, setFunctionSums] = useState<FunctionStatsWithGit>({});
  const [pivotTable, setPivotTable] = useState<PivotTable>({});

  useEffect(() => {
    const rootDirectory = './data2/';
    const csvFiles = ['perf.data.tar.gz.csv']; // Replace with actual CSV file names
    const promises = [];
    //csvFiles.map((csvFile) => csvFile));
      //processCsv(`${rootDirectory}${csvFile}`, functionSums)    
    Promise.all(promises).then(() => {
      setFunctionSums(functionSums);
      const pivotTable = pivotFunctionStats(functionSums);
      setPivotTable(pivotTable);
      //writePivotTableToCsv(pivotTable, 'pivot_table.csv');
    });
  }, []);

  return (
    <div>
      <h1>Reporting Component</h1>
      <p>Function Sums: {Object.keys(functionSums).length}</p>
      <p>Pivot Table:</p>
      <table>
        <thead>
          <tr>
            <th>Function Key</th>
            {Object.keys(pivotTable).length > 0 &&
              Object.keys(pivotTable[Object.keys(pivotTable)[0]]).map((gitUrl) => (
                <th key={gitUrl}>{gitUrl}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(pivotTable).map((functionKey) => (
            <tr key={functionKey}>
              <td>{functionKey}</td>
              {Object.keys(pivotTable[functionKey]).map((gitUrl) => (
                <td key={gitUrl}>{pivotTable[functionKey][gitUrl]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportingComponent2;
