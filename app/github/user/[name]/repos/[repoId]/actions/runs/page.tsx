//"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
//import { useState, useEffect } from "react";
import { fetchRuns, WorkflowRun } from "@/lib/github"
//import { fetchActionData, fetchRunDetails, getJobs } from "../../../../../../../../lib/github"
import { Badge} from "@/components/ui/badge"
export default async function Page(
  {
    params,
  }:{
    params: Promise<{ 
      name:string, 
      repoId:string }>
  })
{
  const theName = (await params).name;
  const theRepo = (await params).repoId;
  const { runs } =  await fetchRuns(theName,theRepo);
  console.log("RUNS",runs);
  return (<div>
	    name:{theName}

	            <WorkflowRunsList owner={theName} repo={theRepo} runs={runs} />

      </div>)
}
//      {runs.map((a)=><div>{"a.name"}</div>)}

  //const [data, setData] = useState({ runs: [], workflows: [] });
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  //useEffect(() => {
    //const fetchData = async () => {   try {
        //setLoading(true);
        //const result = await fetchActionData(owner, repo);
        //setData(result);
      //} catch (err) {
//        setError(err.message);
      //} finally {
//        setLoading(false);
      //}
    //};
//    fetchData();
  //}, [owner, repo]);
  //if (loading) return <div className="animate-pulse">Loading workflow runs...</div>;
  //if (error) return <div className="text-red-500">Error: {error}</div>;

function WorkflowRunsList({ owner, repo, runs }){
  console.log("DEBUG RUNS",runs);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Workflow Runs</h2>
      <div className="grid gap-4">
        {runs.map((run: WorkflowRun) =>( 
	  <Card key={run.id}>
	    <CardHeader>
	      <CardTitle className="flex items-center justify-between"><span>{run.name}</span>
  <Badge> status={run.status} conclusion={run.conclusion} </Badge></CardTitle>
	      <CardDescription>
  Branch: {run.head_branch} • Commit: {run.head_sha.substring(0, 7)}
		</CardDescription>
              </CardHeader>
              <CardContent>
		<div className="text-sm text-gray-500">
                  Started: {new Date(run.created_at).toLocaleString()}
		</div>
              </CardContent>
            </Card>
))}
	  </div>
    </div>
  );
};
