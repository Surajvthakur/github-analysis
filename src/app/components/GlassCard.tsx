"use client";

import * as React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`group [perspective:1000px] ${className}`}
        {...props}
      >
        <div className="relative h-full w-full rounded-[32px] bg-gradient-to-br from-zinc-900/95 to-black/95 shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,0,0,0.3)_30px_50px_25px_-40px,rgba(0,0,0,0.1)_0px_25px_30px_0px] group-hover:[transform:rotate3d(1,1,0,8deg)]">
          {/* Glass morphism layer with enhanced effect */}
          <div className="absolute inset-2 rounded-[30px] border-b border-l border-white/25 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-md [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"></div>
          
          {/* Additional glass reflection layer */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none [transform-style:preserve-3d] [transform:translate3d(0,0,20px)]"></div>
          
          {/* Content layer with proper z-index */}
          <div className="relative h-full w-full [transform:translate3d(0,0,26px)] z-10">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;

