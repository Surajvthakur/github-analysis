"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CollaborationNetworkProps {
  contributors: Array<{
    login: string;
    contributions: number;
    avatar_url?: string;
  }>;
}

export default function CollaborationNetwork({
  contributors: initialContributors,
}: CollaborationNetworkProps) {
  const networkRef = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [contributors] = useState(() =>
    initialContributors.map((c) => {
      // Use avatar_url from API if available, otherwise use GitHub's avatar service
      // GitHub's avatar service handles bots and special characters correctly
      const encodedLogin = encodeURIComponent(c.login);
      return {
        ...c,
        avatar_url: c.avatar_url || `https://avatars.githubusercontent.com/${encodedLogin}`,
      };
    })
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !networkRef.current || contributors.length === 0) return;

    let visNetwork: any = null;

    // Dynamic import to avoid SSR issues
    import("vis-network/standalone")
      .then(({ Network }) => {
        if (!networkRef.current) return;

        // Create nodes
        const nodes = contributors.map((contributor) => {
          // Use avatar_url from API if available, otherwise use GitHub's avatar service
          const encodedLogin = encodeURIComponent(contributor.login);
          return {
            id: contributor.login,
            label: contributor.login,
            value: contributor.contributions,
            shape: "circularImage",
            image: contributor.avatar_url || `https://avatars.githubusercontent.com/${encodedLogin}`,
            size: Math.max(20, Math.min(50, contributor.contributions / 10)),
            color: {
              border: "#3b82f6",
              background: "#1f2937",
            },
          };
        });

        // Create edges (connect all contributors to show collaboration)
        const edges = [];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            edges.push({
              from: nodes[i].id,
              to: nodes[j].id,
              color: { color: "#4b5563", opacity: 0.3 },
              width: 1,
            });
          }
        }

        const data = { nodes, edges };

        const options: any = {
          nodes: {
            borderWidth: 2,
            font: {
              color: "#9ca3af",
              size: 12,
            },
          },
          edges: {
            smooth: {
              enabled: true,
              type: "continuous",
              roundness: 0.5,
            },
          },
          physics: {
            stabilization: {
              iterations: 200,
            },
            barnesHut: {
              gravitationalConstant: -2000,
              centralGravity: 0.1,
              springLength: 200,
              springConstant: 0.04,
            },
          },
          interaction: {
            hover: true,
            tooltipDelay: 100,
          },
        };

        visNetwork = new Network(networkRef.current, data, options);
        setNetwork(visNetwork);
      })
      .catch((error) => {
        console.error("Error loading vis-network:", error);
      });

    return () => {
      if (visNetwork) {
        visNetwork.destroy();
      }
    };
  }, [contributors, isClient]);

  if (contributors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No collaboration data available
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="w-full h-96 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center">
        <div className="text-gray-400">Loading network...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-100">
        Collaboration Network
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Visualize contributor relationships and collaboration patterns
      </p>
      <div
        ref={networkRef}
        className="w-full h-96 rounded-lg bg-gray-900 border border-gray-700"
      />
      <div className="mt-4 text-xs text-gray-500">
        {contributors.length} contributors • Drag nodes to explore
      </div>
    </motion.div>
  );
}
