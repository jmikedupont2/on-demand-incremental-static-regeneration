
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
  const { workflows } =  await fetchWorkflows(theName,theRepo);
  return (<div>    name:{theName}    repoId:{theRepo} {
    workflows.map((a)=>{
      return (<div>{a}</div>)
  })
  } </div>)
}

function fetchWorkflows(theName: string, theRepo: string): { workflows: any; } | PromiseLike<{ workflows: any; }> {
  throw new Error("Function not implemented.");
}

