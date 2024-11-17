import 'server-only';

import { exec } from 'child_process';
import console from 'console'; // Ensure console is defined

//import jwt from 'jsonwebtoken';
//import { notFound } from 'next/navigation';
//import { finished, Readable } from 'stream';
//import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as unzip from 'unzip-stream';

import {  WriteStream } from "fs";
import { pipeline } from "stream";
import { fetchGitHubStream } from './github';
import { createReadStream, createWriteStream } from "fs";
import gunzip from "gunzip-maybe";
import tarStream from "tar-stream";
//import * as tar from 'tar';
import * as zlib from 'zlib';
import { writeFileSync } from 'node:fs';

import { promisify } from "util";
import { sourceMapsEnabled } from 'process';

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
    const unzipStream = fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: destPath }));
    unzipStream.on('close', resolve);
    unzipStream.on('error', reject);
    console.log("return", unzipStream);
  });
}

// // Function to untar the .tar file
// async function untarFile(tarFilePath: string, destPath: string): Promise<void> {
//   console.log("unTar ",tarFilePath,destPath);
//   // extracting a directory
//   let res = fs.createReadStream(tarFilePath)//.pipe(gunzip()).pipe(extract(target));
//   const extract2 = res.pipe(gunzip()).pipe(extract(destPath, { strip: 1 }));
//   extract2.on('finish', () => {
//     process.stdout.write(`Extracted to ${destPath}\n`);
//     //resolve();
//   });
//   //extract2.on('error', reject);
//   await extract2();
//   console.log("Tar extraction complete");
// }

const pipelineAsync = promisify(pipeline);

export type TarballDetails = {
  fileCount: number;
  unpackedSize: number; // in bytes
  parsedJson: Record<string, any>; // Object to store parsed JSON trees
};


async function processTarGz(tarpath: string): Promise<string[][]> {
  const functionSequences: string[][] = [];
  const fileContents = new Map<string, Buffer>();
  await new Promise((resolve, reject) => {
    //const extract = tar.extract();
    const fileStream = fs.createReadStream(tarpath).pipe(zlib.createGunzip());
    //extract.on('entry', async (header, stream, next) => {
//      if (header.type === 'File' && header.path.endsWith('cpuprofile')) {
//	const chunks: any[] = [];
//	if (header) {
	  //header.on('data', (chunk:any) =>{
//	    chunks.push(Buffer.from(chunk))
	  //});
	  //header.on('end', () =>{
//	    let jsonContent:string = Buffer.concat(chunks).toString("utf-8");
	    //const profile = JSON.parse(jsonContent);
	    //let report = {};
      //console.log("debug", profile);
	    //let res = process(tarpath,profile,0,0,report);
	    //console.log("check",tarpath + ".parquet");
	    //writeFunctionStatsToCSV(report,tarpath + ".csv");
	    //writeFunctionStatsToParquet(report,tarpath + ".parquet");
	    //writeFunctionStatsToJSON(report,tarpath + ".json");
	    
	    //console.log(header.path,res);
	  //});
	//}
      //}
    //});
   // extract.on('finish', resolve);
    //extract.on('error', reject);
   // fileStream.pipe(extract);
  });

  // Process files in sorted order
  const sortedFiles = Array.from(fileContents.keys()).sort();

  for (const fileName of sortedFiles) {
    const content = fileContents.get(fileName)!;

    try {
      const jsonContent = content.toString('utf8');
      const profile = JSON.parse(jsonContent);

      //console.log(profile);
    } catch (error) {
      console.warn(`Failed to process ${fileName}: ${error}`);
      continue;
    }
  }

  return functionSequences;
}
async function extractTarGz(tarpath: string, extractPath: string): Promise<void> {
  console.log("extractTarGz",tarpath);
  return new Promise((resolve, reject) => {
    //fs.mkdirSync(extractPath, { recursive: true });
    fs.createReadStream(tarpath)
      .pipe(zlib.createGunzip())
      //.pipe(tar.extract({ cwd: extractPath }))
      .on('end', resolve)
      .on('error', reject);
  });
}

export async function unpackTarballBad(
  tarFilepath: string,
  dest: string
): Promise<TarballDetails> {
  let fileCount = 0;
  let unpackedSize = 0;
  const parsedJson: Record<string, any> = {};
  //  const readable = createReadStream(tarFilepath);
  //const unpack = tarStream.extract();

  //return new Promise((resolve, reject) => {
  console.log("pipe:");
  function foo(data:any){
    console.log("foo",data);
  }

  //async function 
  //  const p = new Promise((resolve, reject) => {
  //    console.log("in promise");
    const unzipStream = fs.createReadStream(tarFilepath)
      .pipe(zlib.createGunzip())
      .pipe(tarStream.extract({ //cwd: dest 
        }))
    //const unzipStream = fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: destPath }));
    unzipStream.on('close', function () {
      console.log("close");
  //    resolve(1)
    });
    unzipStream.on('error', function (error) {
      console.log("error",error);
    //  reject()
    });
  console.log("return");
  //return  undefined;
  //});
  
    //  const som = readable
    //    .pipe(gunzip())
    //    .pipe(unpack)
  //    .on("entry", (header, stream, next) => {
      //   fileCount++;
      //   unpackedSize += Number(header.size);
      
      //   if (header.name.endsWith(".cpuprofile")) {
  //      const newname = `${dest}/${header.name.replace("./profile/", "")}`;
  //      console.log("Processing:", header.name, "->", newname);
  //    });//.then(foo);
  
    //om.then(foo);
  //  console.log("som:",som);
      //     let data = "";
      //     const file = createWriteStream(newname);

      //     // Pipe the stream to the file
      //     stream.pipe(file);

      //     // Collect data for JSON parsing
      //     stream.on("data", (chunk) => {
      //       data += chunk.toString();
      //     });

      //     stream.on("end", () => {
      //       try {
      //         parsedJson[header.name] = JSON.parse(data);
      //         console.log(`Parsed JSON from ${header.name}`);
      //       } catch (err) {
      //         console.error(`Error parsing JSON from ${header.name}:`, err);
      //       }
      //       next(); // Proceed to the next entry
      //});

      //     stream.on("error", (err) => {
      //       console.error(`Stream error for ${header.name}:`, err);
      //       next(); // Ensure the pipeline doesn't hang
      //     });
      //   } else {
      //     // For non-JSON files, just resume the stream
      //     stream.resume();
      //     next();
      //   }
      // })
      // .on("finish", () => {
      //   console.log("Extraction complete");
      //   resolve({
      //     fileCount,
      //     unpackedSize,
      //     parsedJson,
      //   });
      // })
      // .on("error", (err) => {
      //   console.error("Error during extraction:", err);
      //   reject(err);
      // });
  //});
  //console.log("pipe1");
  
    return {
      fileCount:0,
      unpackedSize:0,
      parsedJson:{}
    }
  //return 
}

// import gunzipMaybe from 'gunzip-maybe';
// import { Readable } from 'stream';
// import * as tarStream from 'tar-stream';

// from github.com/verdaccio/versaccio
export type TarballDetails2 = {
  fileCount: number;
  unpackedSize: number; // in bytes
};

async function unTarNative(filePath, extractPath) {
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

export async function getTarballDetails(tarFilepath:string): Promise<TarballDetails2> {
  let fileCount = 0;
  let unpackedSize = 0;
  //const readable = Readable.from(buffer);
  const readable = createReadStream(tarFilepath);
  const unpack = tarStream.extract();
  return new Promise((resolve, reject) => {
    readable
      .pipe(gunzip())
      .pipe(unpack)
      .on('entry', (header, stream, next) => {
        fileCount++;
	console.log("entry",header);
        //unpackedSize += Number(header.size);
	stream.resume(); // important to ensure that "entry" events keep firing
	next();
      })
      .on('finish', () => {
	console.log("finish");
        resolve({
          fileCount,
          unpackedSize,
        });
      })
      .on('error', reject);
  });
}

// this hangs randomly
// // from github.com/verdaccio/versaccio
 //export async function unpackTarball(tarFilepath: string, dest:string): Promise<TarballDetails> {
//   let fileCount = 0;
   //let unpackedSize = 0;
 
//   return new Promise((resolve, reject) => {
//     let parsedJson ={};
//     let file:WriteStream;
//     const readable = createReadStream(tarFilepath);
//     const unpack = tarStream.extract();
//     console.log("Hello");
//     //readable
//     //      .pipe(gunzip())
//     // .pipe(unpack)
//       // .on('entry', function (header: { size: any; name: string; }, stream: { resume: () => void; }, next: () => void): void {
//       //   console.log("ENTrY",header);
//       //     // fileCount++;
//       //     // unpackedSize += Number(header.size);
//       //     // if (header.name.endsWith(".cpuprofile")) {
//       //     //   let data = '';
//       //     //   const newname = dest + "/" + header.name.replace("./profile/", "");
//       //     //   file = fs.createWriteStream(newname);
//       //     //   console.log("headername:", header.name, newname);
//       //     //   //stream.pipe(file); //on("data", datacall);
//       //     //   console.log("entry", fileCount, header);
//       //     // }
//       //     // stream.resume(); // important to ensure that "entry" events keep firing
//       //     // next();
//       //   })
//       // .on('finish', function (): void {
//       //     console.log("file", file);
//       //     // if (file) {
//       //     //   file.close();
//       //     // }
//       //     // console.log("finished");
//       //     resolve({
//       //       fileCount,
//       //       unpackedSize,
//       //       parsedJson,
//       //     });
//       //   })
//       // .on('error', function (x): (reason?: any) => void {
//       //     console.log("error", x);
//       //     return reject;
//       //   });
//   });
 //}

async function untarFile(tarFilePath: string, destPath: string): Promise<void> {
  console.log("unTar", tarFilePath, destPath);
  //const data = await unpackTarball(tarFilePath, destPath);
  //const data = await getTarballDetails(tarFilePath);
  const data = await unTarNative(tarFilePath, destPath);
  console.log("after unTar1", data);
  
  // try {
  //   // Create read stream from tar file and process with gunzip and extract
  //   await pipelineAsync(
  //     createReadStream(tarFilePath),
  //     gunzip(),
  //     extract( {  })
  //   );
  //   console.log(`Extracted to ${destPath}`);
  // } catch (error) {
  //   console.error("Error extracting tar file:", error);
  //   throw error; // Rethrow error for caller to handle
  // }
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
  //if (!fs.existsSync(profilepath)) {
  const data = await untarFile(tarFilePath, path);
  console.log("data",data)
  //}
  //  else {
  //console.log("tar already unpacked");
  //}
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
