import styles from '@/styles/Home.module.scss';
import Link from "next/link";
import { Suspense } from "react";
import { fetchIssueAndRepoData, getGithubContent } from "@/lib/github"
import { CommentIcon, ForkIcon, GitHubIcon, IssueIcon, StarIcon } from '@/app/icons';
import { Time } from '@/app/time-ago';

import React from 'react';

import ReactDOM from 'react-dom'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

const Readme: React.FC<{ data: RepositoryDetails }> = async ({ markdown }) => {
  //document.querySelector('#content')
  return(
    <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>
  )
}

interface RepositoryDetails {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
    homepage: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    parent: {
      full_name: string;
    } | null;
    created_at: string;
    updated_at: string;
    default_branch: string;
}

    
const RepositoryInfo: React.FC<{ data: RepositoryDetails }> = async ({ data }) => {
  const {
    id,
    name,
    full_name,
    description,
    homepage,
    stargazers_count,
    forks_count,
    language,
    owner,
    parent,
    created_at,
    updated_at,
    default_branch,
  } = data;

  
  const markdown = await getGithubContent(data.owner.login,
    name,// repo
    default_branch,
    "README.md"
  )// path
    
  return (
    <div>
      <h1>{name}</h1>
      <p>
        Full Name: <a href={`https://github.com/${full_name}`}>{full_name}</a>
      </p>
      <p>Repository ID: {id}</p>
      <p>Description: {description || 'No description'}</p>
      <p>
        Homepage: <a href={homepage || '#'}>{homepage || 'Not specified'}</a>
      </p>
      <p>
        Created by: <a href={`https://github.com/${owner.login}`}>{owner.login}</a>
      </p>
      <p>
        <img src={owner.avatar_url} alt={owner.login} width={50} />
      </p>
      {parent && (
        <p>
          Forked from: <a href={`https://github.com/${parent.full_name}`}>{parent.full_name}</a>
        </p>
      )}
      <p>Language: {language}</p>
      <p>Stars: {stargazers_count}</p>
      <p>Forks: {forks_count}</p>
      <p>Created at: {new Date(created_at).toLocaleString()}</p>
      <p>Updated at: {new Date(updated_at).toLocaleString()}</p>

      <h1>README</h1>
      <Readme markdown={markdown}></Readme>
    </div>
  );
};

//export default 

// app/github/user/[name]/repos/[repoId]/
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
  const { issues, forks_count, stargazers_count, repoDetails } =  await fetchIssueAndRepoData(theName,theRepo);
  const base = `/github/user/${theName}/repos/${theRepo}`;
  const external_user = `https://github.com/${theName}`;
  const external_base = `${external_user}/${theRepo}`;
  const fork = `${external_base}/fork`;

  return (
    <div>     
      <div className={styles.repo}>
	<div className={styles.repo_title}>
	  <GitHubIcon />{' '}<a href={external_user} target="_blank" rel="noreferrer">{theName}</a>{' '}
	/ <Link href={external_base}>{theRepo}</Link>
	</div>
	<div><Link href={base+"/actions"}>View Actions</Link></div>
	<div className={styles.forks_stars}>
	  <a  href={fork} target="_blank" rel="noreferrer">  <ForkIcon /> {new Number(forks_count).toLocaleString()} </a>
	  <a href={external_base} target="_blank" rel="noreferrer" ><StarIcon /> {new Number(stargazers_count).toLocaleString()} </a>
	</div>
      </div>
      <RepositoryInfo data={repoDetails}></RepositoryInfo>
      <div className={styles.issues}>{issues && issues.map && issues.map((issue: any) => (
	<Link key={issue.number} href={`/${issue.number}`} className={styles.issue}>
	  <IssueIcon />
	  <div><div className={styles.issue_title}>{issue.title}</div><div className={styles.issue_desc}>
									<Suspense>
									  {`#${issue.number} opened `}
									  <Time time={issue.created_at} />
									  {` by ${issue.user.login}`}
									</Suspense>
								      </div>
</div>
	  {issue.comments > 0 && (
	    <div className={styles.comment_count}>
	      <CommentIcon /> {new Number(issue.comments).toLocaleString()}
	    </div>
	  )}
	</Link>
      ))}
      </div>
      <h1>JSON</h1>
	  <pre>{JSON.stringify(repoDetails,undefined,2)}</pre>
    </div>)
}
