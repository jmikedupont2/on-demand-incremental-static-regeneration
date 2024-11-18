//import { ReactNode } from "react"
import { fetchWorkflow, Workflow } from "@/lib/github"
export default async function Page(
  {
    params,
  }:{
    params: Promise<{ 
      userName:string, 
      repoId:string, 
      workflowName:string
    }>
  })
{
  const {userName,repoId, workflowName} = await params
  const wf :Workflow= await fetchWorkflow(userName,repoId,workflowName)
  if (wf){
  return (<div>{wf.name}</div>)
}
}

