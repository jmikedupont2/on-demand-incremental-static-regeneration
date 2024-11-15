import Link from "next/link";
import { fetchActionData } from "../../../../../../../lib/github";
export function mapRun(a){
  return (<div>Run <div>{a}</div> </div>)  
}
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
  
  const { runs, workflows } = await fetchActionData(theName,theRepo);
    return (<div>
      name:{theName}
      repoId:{theRepo}
	      <div>runs:<Link href="./actions/runs">{theRepo}</Link></div>
	      	      <div>workflows:<Link href="./actions/workflows">{theRepo}</Link></div>
      {runs.map(mapRun)}
    </div>)
}

