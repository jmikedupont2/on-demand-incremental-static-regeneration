//import React, { useState, useEffect } from 'react';
import { fetchWorkflows } from '../../../../../../../../lib/github';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Clock, GitBranch, Play, Settings } from 'lucide-react';

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
  //const result = await fetchWorkflows(owner, repo);
  const { workflows } =  await fetchWorkflows(theName,theRepo);
  return (<div>    name:{theName}    repoId:{theRepo}

	    {
	      // a simple map
	      workflows.map((a:any)=>{return (<div>{a}</div>)})}
    <WorkflowDashboard 
      owner="your-org" 
      repo="your-repo"
      workflows={workflows}
    />
	  </div>  
  );
}

interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}

//interface WorkflowsResponse {
//  total_count: number;
//  workflows: Workflow[];
//}


interface WorkflowsListProps {
  owner: string;
  repo: string;
  workflows: any;
  onWorkflowSelect?: (workflow: Workflow) => void;
}

  //  const [data, setData] = useState<{ workflows: Workflow[] }>({ workflows: [] });
  //  const [loading, setLoading] = useState(true);
  //  const [error, setError] = useState<string | null>(null);
  //  useEffect(() => {
  //    const fetchData = async () => {
  //      try {
  //        setLoading(true);
  //setData(result);
  //} catch (err) {
  //        setError(err instanceof Error ? err.message : 'An error occurred');
  //      } finally {
  //        setLoading(false);
  //      }
  //    };
  //fetchData();
  //  }, [owner, repo]);

const WorkflowsList = ({ //owner, repo,
  onWorkflowSelect, workflows }: WorkflowsListProps) => {
  const getWorkflowIcon = (path: string) => {
    if (path.includes('deploy')) return <Activity className="w-4 h-4" />;
    if (path.includes('build')) return <Settings className="w-4 h-4" />;
    if (path.includes('test')) return <Play className="w-4 h-4" />;
    return <GitBranch className="w-4 h-4" />;
  };

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       {[1, 2, 3].map((i) => (
  //         <Card key={i} className="animate-pulse">
  //           <CardContent className="h-24" />
  //         </Card>
  //       ))}
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Card className="bg-red-50">
  //       <CardContent className="p-4">
  //         <div className="text-red-500">Error loading workflows: {error}</div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workflows</h2>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {workflows.length} total
        </Badge>
      </div>

      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card 
            key={workflow.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onWorkflowSelect?.(workflow)}
          >
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getWorkflowIcon(workflow.path)}
                  <div>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {workflow.path.replace('.github/workflows/', '')}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant={workflow.state === 'active' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {workflow.state}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>ID: {workflow.id}</span>
                <span>Updated {formatDateRelative(workflow.updated_at)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(workflow.html_url, '_blank');
                  }}
                >
                  View on GitHub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(workflow.badge_url, '_blank');
                  }}
                >
                  View Badge
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Example usage component
function WorkflowDashboard({ owner, repo, workflows }: { owner: string; repo: string, workflows:any }) {
  const handleWorkflowSelect = (workflow: Workflow) => {
    console.log('Selected workflow:', workflow);
    // Handle workflow selection, e.g., navigate to workflow details
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>GitHub Workflows Dashboard</CardTitle>
          <CardDescription>
            Viewing workflows for {owner}/{repo}
          </CardDescription>
        </CardHeader>
      </Card>

      <WorkflowsList 
        owner={owner} 
        repo={repo}
	workflows={workflows}
        onWorkflowSelect={handleWorkflowSelect}
      />
    </div>
  );
}

