import 'server-only';
// FIXME: this huge mess that needs to be refactored
import { exec } from 'child_process';
import console from 'console'; // Ensure console is defined
import * as fs from 'fs';
import * as unzip from 'unzip-stream';
import { fetchGitHubStream } from './github';
import { CPUProfile } from './profileTypes';

// Function to unzip the file
async function unzipFile(zipFilePath: string, destPath: string): Promise<void> {
  console.log("unzipfile",zipFilePath,destPath) 
  return new Promise((resolve, reject) => {
    //console.log("in promise");
    const unzipStream = fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: destPath }));
    unzipStream.on('close', resolve);
    unzipStream.on('error', reject);
    //console.log("return", unzipStream);
  });
}

export type TarballDetails = {
  fileCount: number;
  unpackedSize: number; // in bytes
  parsedJson: Record<string, any>; // Object to store parsed JSON trees
};

export type TarballDetails2 = {
  fileCount: number;
  unpackedSize: number; // in bytes
};

async function unTarNative(filePath:string, extractPath:string): Promise<void> {
  if (!filePath ||!extractPath) {
    throw new Error('File path or extract path not defined.');
  }
  try {
    const command = `tar -xzf ${filePath} -C ${extractPath}`;
    console.log(`Executing command: ${command}`);
    const foo = await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
	        console.log("stdout", stdout)
          resolve({ stdout, stderr });
        }
      });
    });
  } catch (error) {
    console.error('Error extracting archive:', error);
  }
}

async function untarFile(tarFilePath: string, destPath: string): Promise<void> {
  console.log("unTar", tarFilePath, destPath);
  //const data = await unpackTarball(tarFilePath, destPath);
  //const data = await getTarballDetails(tarFilePath);
  const data = await unTarNative(tarFilePath, destPath);
  console.log("after unTar1", data);
  
}

// Function to process the JSON files
async function processJsonFiles(directory: string): Promise<any[]> {

  if (!fs.existsSync(directory)) {
    console.log("missing",directory);
    return [];
  }
  const jsonFiles = await fs.promises.readdir(directory);
  let profiles:any[] = [];
  for (const file of jsonFiles) {
    if (file.endsWith('.cpuprofile')) {
      const filePath = directory + "/" + file;
      const jsonData = await fs.promises.readFile(filePath, 'utf-8');
      const parsedJson = JSON.parse(jsonData);
      parsedJson.fileName = file;
      //console.log("Parsed JSON blob:", parsedJson);
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
  if (!fs.existsSync(zipFilePath)) {
    console.log("Cannot find",zipFilePath);
  }
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
  //if (!fs.existsSync(profilepath)) {
  const data = await untarFile(tarFilePath, path);
  console.log("data",data)
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
  //console.log("RES",response);
  return  response;
}
