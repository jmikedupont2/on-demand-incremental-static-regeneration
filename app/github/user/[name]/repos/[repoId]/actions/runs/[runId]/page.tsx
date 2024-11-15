import { fetchRuns } from "../../../../../../../../../lib/github";

function mapJobs(a){return (<div>{a}</div>)}

export default async function Page(
  {
    params,
  }:{
    params: Promise<{ 
      name:string, 
      repoId:string,
      runId:string,
    }>
  })
{
  const params2 = await params;
  const theName = params2.name;
  const theRepo = params2.repoId;
  const theRun = params2.runId;

  const {runData,jobsData,artifactsData} = fetchRunDetails(theName,theRepo,theRun)
  return (<div>
	    name:{theName}
      repoId:{theRepo}
      run:{theRun}
      jobsData.map(mapJobs)
      artifactsData.map(mapJobs)
      </div>)
}


function fetchRunDetails(theName: string, theRepo: string, theRun: string): { runData: any; jobsData: any; artifactsData: any; } {
  throw new Error("Function not implemented.");
}

