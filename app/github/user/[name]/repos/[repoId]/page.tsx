import styles from '@styles/Home.module.scss';
import Link from "next/link";
import { Suspense } from "react";
import { fetchIssueAndRepoData } from "@/lib/github"
import { CommentIcon, ForkIcon, GitHubIcon, IssueIcon, StarIcon } from '@/app/icons';
import { Time } from '@/app/time-ago';

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
  const { issues, forks_count, stargazers_count } =
    await fetchIssueAndRepoData(theName,theRepo);
  
  return (<div>
    <div>name:{theName}repoId:{theRepo}</div>
	  <div>actions: <Link href={`/github/user/${theName}/repos/${theRepo}/actions`}>ActionLink1</Link>
    <Link href="/github/user/{theName}/repos/{TheRepo}/actions">ActionLink2</Link>
  done
</div>
	     <div className={styles.repo}>
        <div className={styles.repo_title}>
          <GitHubIcon />{' '}
          <a
            href="https://github.com/{name}/{repoId}"
            target="_blank"
            rel="noreferrer"
          >
            {theName}
          </a>{' '}
          / <Link href="/">{theRepo}</Link>
        </div>
        <div className={styles.forks_stars}>
          <a
            href="https://github.com/{name}/{repoId}/fork"
            target="_blank"
            rel="noreferrer"
          >
            <ForkIcon /> {new Number(forks_count).toLocaleString()}
          </a>
          <a
            href="https://github.com/{name}/{repoId}"
            target="_blank"
            rel="noreferrer"
          >
            <StarIcon /> {new Number(stargazers_count).toLocaleString()}
          </a>
        </div>
      </div>
      <div className={styles.issues}>
        {issues && issues.map && issues.map((issue: any) => (
          <Link
            key={issue.number}
            href={`/${issue.number}`}
            className={styles.issue}
          >
            <IssueIcon />
            <div>
              <div className={styles.issue_title}>{issue.title}</div>
              <div className={styles.issue_desc}>
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
      </div></div>)
      }
