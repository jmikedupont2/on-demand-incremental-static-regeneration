import React from 'react';
import { name } from 'tar/dist/commonjs/types';
//import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
/// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function report(item){
  //console.log("DEBUG",item)
  return (<li key={item.name}>{item.name}/{item.total}</li>)
}
const FunctionProfileChart = ({ data }) => {
  //console.log("FunctionProfileChart",data);
  const top10Functions = Object.keys(data.functionProfile)
  .filter((key)=>{
    //console.log(key);
    //return key.includes("mult")
    return true
  })
   .map(key => ({ name: key, total: data.functionProfile[key].total }))
   .sort((a, b) => b.total - a.total)
   .slice(0, 10);
  //console.log("DEBUG",top10Functions);
  return (
    <div key={data.cpuProfile}>{data.cpuProfile}
    <ol>
      {top10Functions.map(report)}
    </ol>
    </div>
  );
};

export default FunctionProfileChart;
