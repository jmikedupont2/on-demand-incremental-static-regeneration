import styles from '../styles/Home.module.scss';
import Explanation from './explanation';
import { RepoList } from './github/user/[name]/repos';

export default async function Page() {
  return (
    <main className={styles.main}>
      <Explanation />
      <div>{RepoList()} </div>
    </main>
  );
}
