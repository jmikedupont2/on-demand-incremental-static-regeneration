import Link from "next/link";
import { fetchGithubArtifact } from "../../../../../../../../../../../../lib/github";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
  return (<div>
	    Process!
	  </div>)
    }

