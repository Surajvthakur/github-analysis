"use client";

import { motion } from "framer-motion";
import { Achievement } from "@/lib/gamification";

interface AchievementBadgesProps {
  achievements: Achievement[];
}

export default function AchievementBadges({
  achievements,
}: AchievementBadgesProps) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-100">Achievements</h3>
        <div className="text-sm text-gray-400">
          {unlocked.length} / {achievements.length} unlocked
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-semibold text-gray-200">
            {Math.round((unlocked.length / achievements.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlocked.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-200">
            Unlocked ({unlocked.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unlocked.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 text-center"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="font-semibold text-sm text-gray-100 mb-1">
                  {achievement.name}
                </p>
                <p className="text-xs text-gray-400">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {locked.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-200">
            Locked ({locked.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {locked.map((achievement, index) => {
              const progress = (achievement.progress / achievement.maxProgress) * 100;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 text-center relative overflow-hidden"
                >
                  <div className="text-4xl mb-2 opacity-50 grayscale">
                    {achievement.icon}
                  </div>
                  <p className="font-semibold text-sm text-gray-500 mb-1">
                    {achievement.name}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  <div className="mt-2">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-600 transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.progress} / {achievement.maxProgress}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
