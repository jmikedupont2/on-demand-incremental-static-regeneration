
export default async function Page(
  {
    params,
  }:{
    params: Promise<{ 
      name:string, 
      repoId:string,
      runId:string,
      artifactId:string 
    }>
  })
{
  const params2 = await params;
  const theName = params2.name;
  const theRepo = params2.repoId;
  const theRun = params2.runId;
  const theArtifact = params2.artifactId;
  ///const { issues, forks_count, stargazers_count } =   await fetchIssueAndRepoData(theName,theRepo); 
  return (<div>
	    name:{theName}
      repoId:{theRepo}
      run:{theRun}
      artifact:{theArtifact}
      </div>)
    }
