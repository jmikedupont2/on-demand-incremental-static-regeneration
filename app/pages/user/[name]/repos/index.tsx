import { fetchRepoList } from "../../../../../lib/github";

export async function RepoList() {
  const { repos } = await fetchRepoList();
  //console.log("REPOS", repos);
  const result = repos.map((a: any) => {
        console.log("repos2",a);
	return a.map((b:any) => {
    console.log("repo",b)
	  return (<div>Repo {b.full_name} </div>)
	})
      });
  return (<div>{result}</div>);
}
