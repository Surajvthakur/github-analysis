"use client";

import SearchBar from "./components/SearchBar";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          GitHub Analytics
        </h2>
        <p className="text-xl text-gray-300 mb-2">
          Discover insights from GitHub profiles
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Visualize repositories, contributions, languages, and activity with interactive charts and beautiful visualizations
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <SearchBar />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
      >
        {[
          { icon: "📊", title: "Interactive Charts", desc: "Bar, line, pie, radar, and more" },
          { icon: "🔥", title: "Heatmaps", desc: "Visualize contribution activity" },
          { icon: "🌐", title: "Network Views", desc: "Explore repository relationships" },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.05 }}
            className="p-6 rounded-xl bg-gray-800/90 backdrop-blur border border-gray-700 shadow-lg text-center"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="font-bold text-lg mb-2 text-gray-100">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}