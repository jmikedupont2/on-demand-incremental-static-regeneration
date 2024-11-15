import Link from "next/link";
import { fetchRunDetails, fetchRuns } from "../../../../../../../../../lib/github";

function mapJobs(a){return (<div key={a.id}>{a.name}</div>)}

// github/user/[name]/repos/[repoId]/actions/runs/[runId]/artifacts/[artifactId]/page.tsx
// /artifacts/[artifactId]/page.tsx
function mapArtifacts(runId,a){
  //https://github.com/meta-introspector/zkcloudworker-tests/actions/runs/11546257546/artifacts/2110184274
  const href= `./${runId}/artifacts/${a.id}`;  
  return (<div key={a.id}>artifact:<Link href={href}>{a.name}</Link></div>)
}


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
  const {//runData,
    jobsData,artifactsData} = await fetchRunDetails(theName,theRepo,theRun)
  return (<div>
	    name:{theName}
      repoId:{theRepo}
	    run:{theRun}
	    <div><h1>jobs</h1> {jobsData.map(mapJobs)}</div>
	    <div><h1>artifacts</h1> {artifactsData.map(((a)=>mapArtifacts(theRun,a)))}
</div>
	    
</div>
)
}


