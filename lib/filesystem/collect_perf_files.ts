import * as fs from 'fs';
import * as path from 'path';

// Represents the call frame for a node
interface CallFrame {
  functionName: string; // The name of the function
  scriptId: string;     // ID of the script
  url: string;          // URL of the script
  lineNumber: number;   // Line number in the script
  columnNumber: number; // Column number in the script
}

// Represents a single node in the profile
interface ProfileNode {
  id: number;           // Unique identifier for the node
  callFrame: CallFrame; // Details about the function
  hitCount: number;     // Number of times this function was called
  children?: number[];  // IDs of child nodes (optional)
}

// The structure of the CPU profile
interface CPUProfile {
  nodes: ProfileNode[]; // Array of all nodes in the profile
  startTime: number;    // Start time of the profiling (in microseconds)
  endTime: number;      // End time of the profiling (in microseconds)
  samples: number[];    // Array of sampled node IDs
  timeDeltas?: number[]; // (Optional) Time intervals between samples
}

export interface DirObj{
  pathName:string,// the relative path from project root
  owner?:string, // user or org
  repo?:string,// git repo name
  run?:string, // runid
  cpuProfile?:string, // profile obj
  profileData?:CPUProfile, // blob of profile data
  error?:any  // was there an error
}
function getLayerCommon(dirObj:DirObj,keyName:string) {
  //console.log("getLayerCommon",dirObj);
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
  return getLayerCommon(dirObj,"cpuprofile")
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
        const profileObj =  Object.assign({},repoDirs,userDir, repoDir,run, {  pathName:profile});	  
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

