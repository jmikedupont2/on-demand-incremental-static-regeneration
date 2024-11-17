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
