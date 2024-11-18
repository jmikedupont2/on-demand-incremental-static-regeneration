//import Link from "next/link";
import { fetchGithubArtifact } from "@/lib/github";
//import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type ArtifactProps = {
  artifact: {
    id: number;
    node_id: string;
    name: string;
    size_in_bytes: number;
    url: string;
    archive_download_url: string;
    expired: boolean;
    created_at: string;
    updated_at: string;
    expires_at: string;
    workflow_run: {
      id: number;
      repository_id: number;
      head_repository_id: number;
      head_branch: string;
      head_sha: string;
    };
  };
};

function rewriteDownloadUrl(originalUrl: string) {
  const githubPattern = /^https:\/\/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/actions\/artifacts\/(\d+)\/zip$/;
  const match = originalUrl.match(githubPattern);

  if (match) {
    const [, username, reponame, artifactId] = match;
    return `/api/repos/${username}/${reponame}/actions/artifacts/${artifactId}/zip`;
  }

  return originalUrl; // Fallback to the original URL if it doesn't match
}

const ArtifactDisplay: React.FC<ArtifactProps> = ({ artifact }) => {
  const formatDate = (date: string) => new Date(date).toLocaleString();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>GitHub Artifact: {artifact.name}</h2>
      <ul style={styles.list}>
        <li>
          <strong>ID:</strong> {artifact.id}
        </li>
        <li>
          <strong>Node ID:</strong> {artifact.node_id}
        </li>
        <li>
          <strong>Name:</strong> {artifact.name}
        </li>
        <li>
          <strong>Size:</strong> {(artifact.size_in_bytes / 1024).toFixed(2)} KB
        </li>
        <li>
          <strong>URL:</strong>{" "}
          <a href={artifact.url} >
            View Artifact
          </a>
        </li>
        <li>
          <strong>Download URL:</strong>{" "}
          <a
            href={rewriteDownloadUrl(artifact.archive_download_url)}
          >
            Download
          </a>
        </li>
        <li>
          <strong>Expired:</strong> {artifact.expired ? "Yes" : "No"}
        </li>
        <li>
          <strong>Created At:</strong> {formatDate(artifact.created_at)}
        </li>
        <li>
          <strong>Updated At:</strong> {formatDate(artifact.updated_at)}
        </li>
        <li>
          <strong>Expires At:</strong> {formatDate(artifact.expires_at)}
        </li>
      </ul>
      <h3 style={styles.subheading}>Workflow Run Details</h3>
      <ul style={styles.list}>
        <li>
          <strong>Workflow Run ID:</strong> {artifact.workflow_run.id}
        </li>
        <li>
          <strong>Repository ID:</strong> {artifact.workflow_run.repository_id}
        </li>
        <li>
          <strong>Head Repository ID:</strong>{" "}
          {artifact.workflow_run.head_repository_id}
        </li>
        <li>
          <strong>Head Branch:</strong> {artifact.workflow_run.head_branch}
        </li>
        <li>
          <strong>Head SHA:</strong> {artifact.workflow_run.head_sha}
        </li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    marginBottom: "16px",
  },
  subheading: {
    marginTop: "16px",
    marginBottom: "8px",
  },
  list: {
    listStyleType: "none",
    paddingLeft: "0",
  },
};

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
  const artifact = await fetchGithubArtifact(theName,theRepo,theRun,theArtifact);
  return (<div>
	    Process!
	    <ArtifactDisplay  artifact={ artifact.artifact2 }></ArtifactDisplay>
	  </div>)
    }

