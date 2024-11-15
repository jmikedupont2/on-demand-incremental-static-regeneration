import { fetchRuns } from "../../../../../../../../lib/github"

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
  
  return (<div>
	    name:{theName}
      {runs.map((a)=><div>{a}</div>)}
      </div>)
      }
