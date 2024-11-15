import { fetchGithubArtifact } from "../../../../../../../../../../../lib/github";

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
  const { artifact2 } =   await fetchGithubArtifact(theName,theRepo,theRun,theArtifact); 
  return (<div>
	    name:{theName}
      repoId:{theRepo}
      run:{theRun}
	    artifact:{theArtifact}
	    {artifact2}
      </div>)
    }

