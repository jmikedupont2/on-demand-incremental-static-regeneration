import styles from '../../styles/Home.module.scss';
import Link from 'next/link';
import { GitHubIcon, LinkIcon } from '../icons';
import Explanation from '../explanation';
import { use } from 'react';

export default function IssueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const id = use(params).id;
  return (
    <main className={styles.main}>
      <Explanation />

      <div className={styles.repo}>
        <div className={styles.repo_title}>
          <GitHubIcon />{' '}
          <a
            href="https://github.com/jmikedupont2/on-demand-incremental-static-regeneration"
            target="_blank"
            rel="noreferrer"
          >
            This project
          </a>{' '}
          / <Link href="/">on-demand-isr</Link> /{' '}
          <a
            href={`https://github.com/jmikedupont2/on-demand-incremental-static-regeneration/issues/${id}`}
            target="_blank"
            rel="noreferrer"
          >
            #{id}
          </a>
        </div>
        <div className={styles.issue_comments}>
          <a
            href={`https://github.com/jmikedupont2/on-demand-incremental-static-regeneration/issues/${id}`}
            target="_blank"
            rel="noreferrer"
          >
            <LinkIcon /> {'Open in GitHub'}
          </a>
        </div>
      </div>
      {children}
    </main>
  );
}
