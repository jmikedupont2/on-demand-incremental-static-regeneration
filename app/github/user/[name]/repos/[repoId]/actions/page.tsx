import Link from "next/link";

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
      <Link href="/">{theRepo}</Link>
    </div>)
}
function fetchActionData(theName: string, theRepo: string): { runs: any; workflows: any; } | PromiseLike<{ runs: any; workflows: any; }> {
  throw new Error("Function not implemented.");
}

