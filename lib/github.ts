import 'server-only';
import jwt from 'jsonwebtoken';
import { notFound } from 'next/navigation';

// FIXME: remove constant
const ownerList = [ "jmikedupont2","meta-introspector"]

let accessToken;

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

export async function fetchGitHub(path: string, token: string, opts: any = {}) {
  console.log("fetchGitHub",path,opts);
  let req = await createGitHubRequest(path, token, opts);

  if (req.status === 401) {
    // JWT has expired, cache a new token
    await setAccessToken();
    // Retry request with new cached access token
    req = await createGitHubRequest(path, accessToken, opts);
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

export async function fetchIssueAndRepoData() {
  const [issues, repoDetails] = await Promise.all([
    fetchGitHub('/repos/vercel/on-demand-isr/issues', accessToken),
    fetchGitHub('/repos/vercel/on-demand-isr', accessToken),
  ]);

  console.log('[Next.js] Fetching data for /');
  console.log(`[Next.js] Issues: ${issues.length}`);

  return {
    issues,
    stargazers_count: repoDetails.stargazers_count,
    forks_count: repoDetails.forks_count,
  };
}

type Repository = {
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

export async function fetchRepoList() {

  function fetchGitHubWithToken(path) {   
    const data = fetchGitHub("/users/" + path + "/repos?sort=created&per_page=2", accessToken)
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

export async function fetchIssuePageData(id: string) {
  const [issue, comments, repoDetails] = await Promise.all([
    fetchGitHub(`/repos/vercel/on-demand-isr/issues/${id}`, accessToken),
    fetchGitHub(
      `/repos/vercel/on-demand-isr/issues/${id}/comments`,
      accessToken
    ),
    fetchGitHub('/repos/vercel/on-demand-isr', accessToken),
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
