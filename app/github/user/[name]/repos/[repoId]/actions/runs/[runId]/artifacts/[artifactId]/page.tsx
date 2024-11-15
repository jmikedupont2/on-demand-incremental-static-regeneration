import Link from "next/link";
import { fetchGithubArtifact } from "../../../../../../../../../../../lib/github";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Detailed run information component
function RunDetails({ owner, repo, runId, artifact })
{
  const url = `${artifact.id}/process`;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Artifact</CardTitle>
        </CardHeader>
        <CardContent>
          <div key={artifact.id} 
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div>
            <span>Name: {artifact.name}</span>
            </div>
            <span className="text-sm text-gray-500">
              Size: {(artifact.size_in_bytes / 1024).toFixed(2)} KB
            </span>

	    	   <Link href={url}>Process {artifact.id}</Link>
	    
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
  <RunDetails
    owner={theName}
    repo={theRepo}
    runId={theRun}
    artifact={artifact2}>
  </RunDetails>
	  </div>)
    }

