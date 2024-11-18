
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

  return (<div>
	    name:{theName}
      repoId:{theRepo}
      run:{theRun}

      </div>)
    }
