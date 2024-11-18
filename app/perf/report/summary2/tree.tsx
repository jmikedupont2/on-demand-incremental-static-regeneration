import { CPUProfile, ProfileNode, TreeNodeProps } from "@/lib/profileTypes";

const TreeNode: React.FC<TreeNodeProps> = ({ node, childrenMap }) => {
  //const [expanded, setExpanded] = useState(false);

  const children = childrenMap.get(node.id) || [];
  const expanded = true;
  return (
    <div style={{ marginLeft: 20 }}>
      <div  style={{ cursor: "pointer" }}>
        {children.length > 0 ? (expanded ? "▼ " : "▶ ") : "• "}
        <strong>{node.callFrame.functionName || "(anonymous)"}</strong>{" "}
        (hitCount: {node.hitCount})
      </div>
      {expanded && (
        <div>
	  TODO
        </div>
      )}
    </div>
  );
};

// CPUProfileTree component: Renders the entire tree
const CPUProfileTree: React.FC<{ profile: CPUProfile }> = ({ profile }) => {
  // Build a map of node ID to its children for easy lookup
  const childrenMap = new Map<number, ProfileNode[]>();
  profile.nodes.forEach((node) => {
    if (node.children) {
      node.children.forEach((childId) => {
        if (!childrenMap.has(node.id)) {
          childrenMap.set(node.id, []);
        }
        const childNode = profile.nodes.find((n) => n.id === childId);
        if (childNode) {
          childrenMap.get(node.id)!.push(childNode);
        }
      });
    }
  });

  // Find the root nodes (nodes with no parents)
  const rootNodes = profile.nodes.filter(
    (node) =>
      !profile.nodes.some((parentNode) =>
        parentNode.children?.includes(node.id)
      )
  );

  return (
    <div>
      <h1>CPU Profile Tree</h1>
      <p>
        Profile Duration: {(profile.endTime - profile.startTime) / 1000} ms
      </p>
      <div>
        {rootNodes.map((rootNode) => (
          <TreeNode
            key={rootNode.id}
            node={rootNode}
	    childrenMap={childrenMap}
          />
        ))}
      </div>
    </div>
  );
};
