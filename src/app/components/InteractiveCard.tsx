"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InteractiveCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function InteractiveCard({
  title,
  children,
  className = "",
}: InteractiveCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl bg-white dark:bg-gray-800 backdrop-blur shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all ${className}`}
    >
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}
