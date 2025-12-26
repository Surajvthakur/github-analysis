"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  change?: number;
}

interface AnimatedStatsProps {
  stats: StatCard[];
}

function StatCardComponent({ stat, countedValue, index }: { stat: StatCard; countedValue: number; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 3;
      const rotateY = (x / rect.width) * 3;
      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Convert hex color to rgba for glow effect
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: isHovered ? -5 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.1 },
        y: { type: "spring", stiffness: 300, damping: 20 },
        rotateX: { type: "spring", stiffness: 300, damping: 20 },
        rotateY: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="relative rounded-[24px] overflow-hidden"
      style={{
        transformStyle: "preserve-3d",
        backgroundColor: "#0e131f",
        boxShadow: "0 -10px 100px 10px rgba(78, 99, 255, 0.15), 0 0 10px 0 rgba(0, 0, 0, 0.5)",
        minHeight: "180px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Glass reflection overlay */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(2px)",
        }}
        animate={{
          opacity: isHovered ? 0.7 : 0.5,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Dark background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #000000 70%)",
        }}
      />

      {/* Noise texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-20 mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Color-based glow effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
        style={{
          background: `radial-gradient(ellipse at bottom center, ${hexToRgba(stat.color, 0.4)} -20%, rgba(79, 70, 229, 0) 60%)`,
          filter: "blur(30px)",
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.6,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Bottom border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-25"
        style={{
          background: `linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, ${hexToRgba(stat.color, 0.7)} 50%, rgba(255, 255, 255, 0.05) 100%)`,
        }}
        animate={{
          boxShadow: isHovered
            ? `0 0 20px 4px ${hexToRgba(stat.color, 0.6)}`
            : `0 0 15px 3px ${hexToRgba(stat.color, 0.4)}`,
          opacity: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Card content */}
      <motion.div
        className="relative flex flex-col h-full p-6 z-40"
      >
        {/* Icon circle */}
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{
            background: "linear-gradient(225deg, #171c2c 0%, #121624 100%)",
            position: "relative",
            overflow: "hidden"
          }}
          animate={{
            boxShadow: isHovered
              ? "0 8px 16px -2px rgba(0, 0, 0, 0.3), 0 4px 8px -1px rgba(0, 0, 0, 0.2), inset 2px 2px 5px rgba(255, 255, 255, 0.15), inset -2px -2px 5px rgba(0, 0, 0, 0.7)"
              : "0 6px 12px -2px rgba(0, 0, 0, 0.25), 0 3px 6px -1px rgba(0, 0, 0, 0.15), inset 1px 1px 3px rgba(255, 255, 255, 0.12), inset -2px -2px 4px rgba(0, 0, 0, 0.5)",
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center w-full h-full relative z-10 text-2xl">
            {stat.icon}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              {stat.label}
            </h3>
            {stat.change !== undefined && (
              <span
                className={`text-xs font-semibold ${
                  stat.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
              </span>
            )}
          </div>
          <motion.p
            className="text-3xl font-bold"
            style={{ color: stat.color }}
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{
              filter: "blur(0px)",
              opacity: 1,
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {countedValue.toLocaleString()}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  const [countedValues, setCountedValues] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    stats.forEach((stat) => {
      animateValue(stat.label, 0, stat.value, 1500);
    });
  }, [stats]);

  function animateValue(
    label: string,
    start: number,
    end: number,
    duration: number
  ) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + range * easeOutQuart);

      setCountedValues((prev) => ({ ...prev, [label]: current }));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCardComponent
          key={stat.label}
          stat={stat}
          countedValue={countedValues[stat.label] || 0}
          index={index}
        />
      ))}
    </div>
  );
}
