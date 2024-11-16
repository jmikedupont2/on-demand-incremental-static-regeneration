import { fetchArtifactZip } from "@/lib/github";
//import { NextApiRequest, NextApiResponse } from "next";

export default async function Page(  {
    params,
  }:{
    params: Promise<{ 
      name:string, 
      repoId:string,
      runId:string,
      artifactId:string 
    }>
  }) {
  const { name, repoId, artifactId } = await params;
const username = name;
  if (
    !username ||
    !repoId ||
    !artifactId ||
    typeof username !== "string" ||
    typeof repoId !== "string" ||
    typeof artifactId !== "string"
  ) {
    //res.status(400).json({ error: "Invalid parameters" });
    return;
  }

    //  try {
    // Fetch the artifact from GitHub
    const response = await fetchArtifactZip(username,repoId,artifactId);
    console.log("res",response);
    //response.body?.pipe(res);
    // {response.body }
    function reportFile(a:any){
      return (<div key={a.fileName}>Nodes:{a.fileName}/{a.nodes.length}</div>)
    }
    return (<div>Unzip { response.map( reportFile )}</div>)
    //  } catch (error) {
    //    console.error("Error downloading artifact:", error);
    //    return (<div>{
    //res.status(500).json({ error: "Internal Server Error" });
    //  }
}
