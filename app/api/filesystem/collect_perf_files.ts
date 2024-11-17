// api/files.ts
import * as fs from 'fs';
import * as path from 'path';

//import { fetchArtifactZip } from "@/lib/profileReport";
//import { NextApiRequest, NextApiResponse } from "next";

export default async function Page(  {
    params,
  }:{
    params: Promise<{ 
      //      name:string, 
      //      repoId:string,
      //      runId:string,
      // artifactId:string 
    }>
  }) {
    const args = await params;
    const rootDirectory = './cache/';
    const subdirs = fs.readdirSync(rootDirectory)
      .map(name => path.join(rootDirectory, name))
      .filter(dir => fs.statSync(dir).isDirectory());
    const results = [];

    for (const subdir of subdirs) {
      const perfDataPath = path.join(subdir, 'profile');

      if (!fs.existsSync("profile")) {
	console.log(`No profile found in ${subdir}`);
	continue;
      }

      //    const functionSequences = await processTarGz(perfDataPath);
      //    results.push({
      //      directory: perfDataPath,
      //functionSequences,
      //});
  }
  return results;
}
