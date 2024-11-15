import { ReactNode } from "react"

//import { fetchWorkflow } from "../../../../../../../../../lib/github"
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
  const wf = fetchWorkflow(userName,repoId,workflowName)
  return (<div>{wf}</div>)
}
function fetchWorkflow(userName: string, repoId: string, workflowName: string) : ReactNode{
  throw new Error("Function not implemented.")
}

