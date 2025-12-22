"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface LiveActivityFeedProps {
  username: string;
}

interface ActivityEvent {
  id: string;
  type: string;
  repo: string;
  timestamp: Date;
}

export default function LiveActivityFeed({
  username,
}: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) return;

    const fetchActivities = async () => {
      try {
        const res = await fetch(
          `/api/github?username=${username}&type=events`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const events = await res.json();
          if (Array.isArray(events)) {
            const recentEvents = events
              .slice(0, 10)
              .map((event: any) => ({
                id: event.id,
                type: event.type,
                repo: event.repo?.name || "Unknown",
                timestamp: new Date(event.created_at),
              }))
              .filter((event) => !isNaN(event.timestamp.getTime()));
            setActivities(recentEvents);
          }
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [username, isLive]);

  const formatEventType = (type: string) => {
    return type.replace("Event", "").replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-100">Live Activity Feed</h3>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              isLive
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {isLive ? (
              <>
                <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Live
              </>
            ) : (
              "Start Live"
            )}
          </button>
        </div>
      </div>

      {isLive ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No recent activity
              </div>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-gray-900/50 border border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-100">
                        {formatEventType(activity.type)}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {activity.repo}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          Click "Start Live" to begin monitoring activity
        </div>
      )}
    </motion.div>
  );
}
