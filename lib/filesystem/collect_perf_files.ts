import * as fs from 'fs';
import * as path from 'path';
import { DirObj } from '../profileTypes';


function getLayerCommon(dirObj:DirObj,keyName:string) {
  //  console.log("getLayerCommon",dirObj,keyName);
  function doSplit(name){
    let obj:DirObj= {
      //keyName:name,
      pathName:path.join(dirObj.pathName, name)
    }
    obj[keyName]=name;
    //console.log("example",obj);
    return obj;
  }
  const dirs:DirObj[] = fs.readdirSync(dirObj.pathName)
    .map(doSplit)
  //  console.log("DEBUG",dirs);
  return dirs;
}

function getLayer(dirObj:DirObj,keyName) {
  return getLayerCommon(dirObj,keyName)
    .filter(dir => fs.statSync(dir.pathName).isDirectory());
}

function getCpuProf(dirObj:DirObj) {
  return getLayerCommon(dirObj,"cpuProfile")
    .filter(dir => fs.statSync(dir.pathName).isFile())
    .filter(dir => dir.pathName.endsWith("cpuprofile"));  
}

function readJson(path:DirObj): DirObj {
  try {
    const content = fs.readFileSync(path.pathName, 'utf8');
    path.profileData = JSON.parse(content);
  } catch (error) {
    path.error = error    
  }
  return path;
}

export async function fetchPerfData(//id: string, user: string, repoId: string
) {
  const rootDirectory = {pathName:'./cache/repos/',
    "root":"repos"};
  const repoDirs = getLayer(rootDirectory,"owner");
  const results:any[] = [];
  for (const userDir of repoDirs) {
    const repoDirs = getLayer(userDir,"repo");
    for (const repoDir of repoDirs) {
      const actions=repoDir.pathName + "/actions";
      const artifact=actions + "/artifacts";
      const runs = getLayer({pathName:artifact},"run");
      for (const run of runs) {
        const runattr = run.pathName + "/zip";
        const profile = runattr + "/profile"; // this is specific to how we store the tar file
        const profileObj =  Object.assign({},repoDir,userDir, repoDir,run, {  pathName:profile});	  
        const cpu_profiles = getCpuProf(profileObj);
        for (const cpu_profile of cpu_profiles) {

	  let profile = Object.assign(profileObj,cpu_profile);
	  profile = readJson(profile)
	  //console.log(profile)
	  results.push(profile);
        }          
      }
    }
  }
  //console.log("results",results);
  return results;
}

