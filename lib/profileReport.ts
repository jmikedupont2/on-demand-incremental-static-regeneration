import 'server-only';
import jwt from 'jsonwebtoken';
import { notFound } from 'next/navigation';
//import { finished, Readable } from 'stream';
//import AdmZip from 'adm-zip';
import * as fs from 'fs';
import unzipper from 'unzipper';
import * as tar from 'tar';
import { fetchGitHubStream } from './github';

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


// Function to unzip the file
async function unzipFile(zipFilePath: string, destPath: string): Promise<void> {
  console.log("unzipfile",zipFilePath,destPath)
  
  return new Promise((resolve, reject) => {
    console.log("in promise");
    const unzipStream = fs.createReadStream(zipFilePath).pipe(unzipper.Extract({ path: destPath }));
    unzipStream.on('close', resolve);
    unzipStream.on('error', reject);
    console.log("return", unzipStream);
  });
}

// Function to untar the .tar file
async function untarFile(tarFilePath: string, destPath: string): Promise<void> {
  console.log("unTar ",tarFilePath,destPath);
  await tar.x({
    file: tarFilePath,
    C: destPath // Extract to the same directory
  });
  console.log("Tar extraction complete");
}


// Function to process the JSON files
async function processJsonFiles(directory: string): Promise<any[]> {
  const jsonFiles = await fs.promises.readdir(directory);
  let profiles:any[] = [];
  for (const file of jsonFiles) {
    if (file.endsWith('.cpuprofile')) {
      const filePath = directory + "/" + file;
      const jsonData = await fs.promises.readFile(filePath, 'utf-8');
      const parsedJson = JSON.parse(jsonData);
      parsedJson.fileName = file;
      console.log("Parsed JSON blob:", parsedJson);
      profiles.push(parsedJson)
      // Further processing can be done here
    }
  }
  return profiles;
}

// Main function to fetch and process the GitHub stream
export async function readZip(path: string, filename:string) {
  const zipFilePath = path + filename;
  console.log("readzip",zipFilePath,path);
  // Step 1: Unzip the file
  const tarFilePath = path + "/perf.data.tar.gz";
  if (!fs.existsSync(tarFilePath)) {
    console.log("going to unzip",zipFilePath, " to get ", tarFilePath);
    await unzipFile(zipFilePath, path);
    console.log("Unzip complete");
  }
  
  // Step 2: Find and untar the .tar file inside the extracted zip

  console.log("TAR",tarFilePath);
  if (!fs.existsSync(tarFilePath)) {
    console.error("No tar file found inside the zip archive");
    return;
  }
  const profilepath = path + "/profile";
  if (!fs.existsSync(profilepath)) {
    await untarFile(tarFilePath, path);
  }
  else {
    console.log("tar already unpacked");
  }
  // Step 3: Read and process JSON files from extracted files
  const files = await processJsonFiles(profilepath);
  return files;
}

export async function processFile(path: string): Promise<CPUProfile[]> {
  console.log("processFile", path);  
  let filename = await fetchGitHubStream(path);
  const returnData = await readZip("cache" + path ,  "/data.zip" );
  if (returnData) {
      return returnData;
  } else {
      return []
  }   
}

export async function fetchArtifactZip(username: string, reponame: string, artifactId:string): Promise<CPUProfile[]> {
  console.log("DEBUG1",username,reponame,artifactId)
  const response = await processFile(`/repos/${username}/${reponame}/actions/artifacts/${artifactId}/zip` );
  console.log("RES",response);
  return  response;
}
