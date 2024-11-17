import * as fs from 'fs';
import * as path from 'path';

function getLayer(dirName) {
  const dirs = fs.readdirSync(dirName)
    .map(name => path.join(dirName, name))
    .filter(dir => fs.statSync(dir).isDirectory());
  return dirs;
}

function getCpuProf(dirName) {
  const dirs = fs.readdirSync(dirName)
    .map(name => path.join(dirName, name))
    .filter(dir => fs.statSync(dir).isFile())
    .filter(dir => dir.endsWith("cpuprofile"));  
  return dirs;
}

export async function fetchPerfData(//id: string, user: string, repoId: string
) {
  const rootDirectory = './cache/';
  const subdirs = getLayer(rootDirectory);
  const results = [];
  
  for (const subdir of subdirs) {
    //const perfDataPath = path.join(subdir, 'profile');
    const repoDirs = getLayer(subdir);
    for (const userDir of repoDirs) {
      //console.log();
      const repoDirs = getLayer(userDir);
      for (const repoDir of repoDirs) {
	const actions = getLayer(repoDir);
	for (const action of actions) {
	  const artifacts = getLayer(action);
	  for (const artifact of artifacts) {
	    const runs = getLayer(artifact);
	    for (const run of runs) {
	      const runattrs = getLayer(run);
	      for (const runattr of runattrs) {
		const profiles = getLayer(runattr);
		for (const profile of profiles) {
		  //console.log('debug1',profile);
		  const cpu_profiles = getCpuProf(profile);
		  //console.log('cpu',cpu_profiles);
		  for (const cpu_profile of cpu_profiles) {
		    //console.log('item',cpu_profile);
		    results.push({ "filename": cpu_profile })
		  }
		}
	      }
	    }
	  }
	}
	
      }
    }
  }
  console.log("results",results);
  return results;
}

