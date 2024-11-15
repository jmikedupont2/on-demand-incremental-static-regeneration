import Link from "next/link";
import { fetchRepoList } from "../../../../../lib/github";
import React from "react";

export async function RepoList() {
  const { repos } = await fetchRepoList();
  //console.log("REPOS", repos);
  const result = repos.map((a: any) => {
    //        console.log("repos2",a);
	return a.map((repo:any) => {
	  //console.log("repo",repo)
	  const repoUrl = `/user/${repo.owner.login}/repos/${repo.name}`;
	  return (<div key={repo.id}>
		    <Link  prefetch={true}  href={repoUrl}
		    >Repo {repo.full_name}</Link>
		  </div>);
	})
      });
  return (<div>{result}</div>);
}
