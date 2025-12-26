"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";

export default function CompareCard({ user }: { user: any }) {
  return (
    <LiquidGlassCard className="p-6 text-center" draggable={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src={user.avatar_url}
            alt={user.login}
            width={120}
            height={120}
            className="rounded-full mx-auto border-4 border-gray-700"
          />
        </motion.div>

        <h2 className="text-2xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {user.name ?? user.login}
        </h2>
        <p className="text-gray-400">@{user.login}</p>

        {user.bio && (
          <p className="text-sm mt-3 text-gray-300">{user.bio}</p>
        )}
      </motion.div>
    </LiquidGlassCard>
  );
}
