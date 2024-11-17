// Represents the call frame for a node
export interface CallFrame {
  functionName: string; // The name of the function
  scriptId: string;     // ID of the script
  url: string;          // URL of the script
  lineNumber: number;   // Line number in the script
  columnNumber: number; // Column number in the script
}

// Represents a single node in the profile
export interface ProfileNode {
  id: number;           // Unique identifier for the node
  callFrame: CallFrame; // Details about the function
  hitCount: number;     // Number of times this function was called
  children?: number[];  // IDs of child nodes (optional)
}

// The structure of the CPU profile
export interface CPUProfile {
  nodes: ProfileNode[]; // Array of all nodes in the profile
  startTime: number;    // Start time of the profiling (in microseconds)
  endTime: number;      // End time of the profiling (in microseconds)
  samples: number[];    // Array of sampled node IDs
  timeDeltas?: number[]; // (Optional) Time intervals between samples
}

// Props for the TreeNode component
export interface TreeNodeProps {
  node: ProfileNode;
  childrenMap: Map<number, ProfileNode[]>;
}

export interface ProcessedData {
  //directory: string;
  functionSequences: string[][];
}

export interface Total {
  total: number;
  count: number;
  min: number;
  max: number;
};

export interface FunctionSums {
  [key: string]: Total
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

export interface DirObj{
  pathName:string,// the relative path from project root
  owner?:string, // user or org
  repo?:string,// git repo name
  run?:string, // runid
  cpuProfile?:string, // profile obj
  profileData?:CPUProfile, // blob of profile data
  error?:any  // was there an error
}
