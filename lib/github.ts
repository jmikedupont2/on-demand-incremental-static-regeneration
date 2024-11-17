import 'server-only';
import jwt from 'jsonwebtoken';
import { notFound } from 'next/navigation';
//import { finished, Readable } from 'stream';
//import AdmZip from 'adm-zip';
import * as fs from 'fs';



// FIXME: remove constant
const ownerList = [ "jmikedupont2","meta-introspector"]

let accessToken:string;

function createGitHubRequest(path: string, token: string, opts: any = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      ...opts.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
  });
}

//octokit.actions.downloadArtifact({owner, repo, artifact_id, archive_format});
function createGitHubRequestStream(path: string, token: string, opts: any = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      ...opts.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      //,
      //      Accept: 'application/vnd.github.v3+json',
    },
  });
}

export async function fetchGitHub(path: string, token: string, opts: any = {}) {
  console.log("fetchGitHub",path,opts);
  let req = await createGitHubRequest(path, token, opts);

  if (req.status === 401) {
    // JWT has expired, cache a new token
    await setAccessToken();
    // Retry request with new cached access token
    req = await createGitHubRequestStream(path, accessToken, opts);
  }

  const ret1= req.json();

  // idea was to wrap the results and add in the arguments as meta to the response
  // but on second thought most of that data will be in the results already
  // const result = {
  //   meta: meta,
  //   path: path,
  //   result: ret1
  // }  
  // return result;
  return ret1;
}



async function getAccessToken(installationId: number, token: string) {

  const data = await fetchGitHub(
    `/app/installations/${installationId}/access_tokens`,
    token,
    { method: 'POST' }
  );

  return data.token;
}

function getGitHubJWT() {
  if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PK_PEM) {
    throw new Error(
      'GITHUB_APP_ID and GITHUB_APP_PK_PEM must be defined in .env.local'
    );
  }

  const myjwt= jwt.sign(
    {
      iat: Math.floor(Date.now() / 1000) - 60,
      iss: process.env.GITHUB_APP_ID,
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes is the max
    },
    process.env.GITHUB_APP_PK_PEM,
    {
      algorithm: 'RS256',
    }
  );

  return myjwt;
}

async function getInstallation(token: string) {
  const installations = await fetchGitHub('/app/installations', token);
  function check(i:any) {
    if (i.app_id == process.env.GITHUB_APP_ID) {
      return true;
    }
    else {
      return false
    }
  }
  return installations.find(check);
}



export async function readAccessToken() {
  // check if exists
  if (!accessToken) {
    await setAccessToken();
  }

  return accessToken;
}

export async function setAccessToken() {
  const jwt = getGitHubJWT();
  const installation = await getInstallation(jwt);

  if (installation) {
    accessToken = await getAccessToken(installation.id, jwt);
    return accessToken;
  } else {
    return undefined;
  }
}

export async function fetchIssueAndRepoData(user:string, repoId:string) {
  const [issues, repoDetails] = await Promise.all([
    fetchGitHub(`/repos/${user}/${repoId}/issues`, accessToken),
    fetchGitHub(`/repos/${user}/${repoId}`, accessToken)
  ]);
  //console.log(`[Next.js] Issues: ${issues.length}`);
  return {
    issues,
    stargazers_count: repoDetails.stargazers_count,
    forks_count: repoDetails.forks_count,
  };
}

export type Repository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type?: string; // Optional, as it may not always be included
    site_admin: boolean;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
};

// Type for an array of repositories
type RepositoriesResponse = Repository[];


export async function fetchRepoList(perPage) {

  function fetchGitHubWithToken(path) {
    // &per_page=${perPage} FIXME: perpage
    const data = fetchGitHub(`/users/${path}/repos?sort=created`, accessToken)
    return     data;
  }
  const fetch_all = ownerList.map(fetchGitHubWithToken);
  const repos:RepositoriesResponse = await Promise.all(fetch_all)
  console.log('[Next.js] Fetching repos');
  console.log(`[Next.js] Repos: ${repos.length}`);

  return {
    ownerList,
    repos
  };
}

export async function fetchIssuePageData(id: string, user: string, repoId: string) {
  const [issue, comments, repoDetails] = await Promise.all([
    fetchGitHub(`/repos/${user}/${repoId}/issues/${id}`, accessToken),
    fetchGitHub(
      `/repos/${user}/${repoId}/issues/${id}/comments`,
      accessToken
    ),
    fetchGitHub('/repos/${user}/${repoId}', accessToken),
  ]);

  console.log(`[Next.js] Fetching data for /${id}`);
  console.log(`[Next.js] [${id}] Comments: ${comments.length}`);

  if (issue.message === 'Not Found') {
    notFound();
  }

  return {
    issue,
    comments,
    stargazers_count: repoDetails.stargazers_count,
    forks_count: repoDetails.forks_count,
  };
}

export async function fetchRuns(user: string, repo: string) {
  const runs = await fetchGitHub(
    `/repos/${user}/${repo}/actions/runs`,
    accessToken
  );

  //  console.log("RUNS",runs);
  return { runs: runs.workflow_runs || [] };
}

export async function fetchActionData(theName: string, theRepo: string) {
  const [runs, workflows] = await Promise.all([
    fetchGitHub(
      `/repos/${theName}/${theRepo}/actions/runs`,
      accessToken
    ),
    fetchGitHub(
      `/repos/${theName}/${theRepo}/actions/workflows`,
      accessToken
    )
  ]);

  return {
    runs: runs.workflow_runs || [],
    workflows: workflows.workflows || []
  };
}

export async function fetchRunDetails(theName: string, theRepo: string, theRun: string) {
  const [runData, jobsData, artifactsData] = await Promise.all([
    fetchGitHub(
      `/repos/${theName}/${theRepo}/actions/runs/${theRun}`,
      accessToken
    ),
    fetchGitHub(
      `/repos/${theName}/${theRepo}/actions/runs/${theRun}/jobs`,
      accessToken
    ),
    fetchGitHub(
      `/repos/${theName}/${theRepo}/actions/runs/${theRun}/artifacts`,
      accessToken
    )
  ]);

  return {
    runData,
    jobsData: jobsData.jobs || [],
    artifactsData: artifactsData.artifacts || []
  };
}

export async function getJobs(theName: string, theRepo: string, theRun: string) {
  const jobsResponse = await fetchGitHub(
    `/repos/${theName}/${theRepo}/actions/runs/${theRun}/jobs`,
    accessToken
  );

  return {
    jobList: jobsResponse.jobs || []
  };
}

export async function fetchGithubArtifact(
  theName: string,
  theRepo: string,
  theRun: string,
  theArtifact: string
) {
  const artifact = await fetchGitHub(
    `/repos/${theName}/${theRepo}/actions/artifacts/${theArtifact}`,
    accessToken,
    {
      headers: {
        Accept: 'application/vnd.github.v3.raw'
      }
    }
  );

  return {
    artifact2: artifact
  };
}

// Add TypeScript interfaces for better type safety
export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  status: string;
  conclusion: string;
  workflow_id: number;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: number;
  name: string;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  run_id: number;
  name: string;
  status: string;
  conclusion: string;
  started_at: string;
  completed_at: string;
  steps: Array<{
    name: string;
    status: string;
    conclusion: string;
    number: number;
  }>;
}

export interface Artifact {
  id: number;
  name: string;
  size_in_bytes: number;
  archive_download_url: string;
  expired: boolean;
  created_at: string;
  updated_at: string;
}


export async function fetchWorkflows(theName: string, theRepo: string) {
  const response = await fetchGitHub(
    `/repos/${theName}/${theRepo}/actions/workflows`,
    accessToken
  );

  return {
    workflows: response.workflows || []
  };
}

export async function fetchWorkflow(theName: string, theRepo: string, workflow:string): Promise<Workflow> {
  const response = await fetchGitHub(
    `/repos/${theName}/${theRepo}/actions/workflows/${workflow}`,
    accessToken
  );
  return  response;
}

export async function fetchGitHubStream(path: string): Promise<string> {
  const newpath = "cache" + path;
  const cachePath = newpath + "/data.zip";

  console.log("fetchGitHubStream", cachePath);

  if (fs.existsSync(cachePath)) {
    console.log(`Cache exists at ${cachePath}, skipping fetch.`);
    return cachePath;
  }

  let req = await createGitHubRequest(path, accessToken, {});
  if (req.status === 401) {
    // JWT has expired, cache a new token
    await setAccessToken();
    // Retry request with new cached access token
    req = await createGitHubRequest(path, accessToken, {});
  }  
  if (req.status !== 200) {
    console.error('Failed to fetch GitHub stream:', req.status);
    return "error";
  }  
  const buffer = Buffer.from(await req.arrayBuffer());

  fs.mkdir(newpath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating cache directory", err);
      return;
    }
    console.log("wrote to", newpath);
    
    // Write file to the cache
    fs.writeFile(cachePath, buffer, (err) => {
      if (err) {
        console.error("Error writing file", err);
      } else {
        console.log("File saved to cache",cachePath);
      }
    });
    });
  return cachePath
}
