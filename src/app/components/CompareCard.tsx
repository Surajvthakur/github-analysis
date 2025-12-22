"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function CompareCard({ user }: { user: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="border rounded-2xl p-6 text-center bg-gray-800/90 backdrop-blur shadow-lg border-gray-700 hover:shadow-xl transition-all"
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
  );
}
