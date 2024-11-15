import Link from "next/link";
import { fetchActionData } from "../../../../../../../lib/github";
function mapRun(a){
  const url = `./actions/${a.id}`
  return (<div key={a.id}>
	   <Link href={url}>run {a.id}</Link>
	  </div>)  
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
  return (<div key="Runs{theName}{theRepo}1">
  name:{theName}
	    repoId:{theRepo}
            len:{runs.length}
	      <div>runs:<Link href="./actions/runs">{theRepo}</Link></div>
	      	      <div>workflows:<Link href="./actions/workflows">{theRepo}</Link></div>
      {runs.map(mapRun)}
	  </div>)
}


