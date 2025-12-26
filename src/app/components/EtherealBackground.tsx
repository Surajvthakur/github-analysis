"use client";

import { Component as EtherealShadow } from "@/components/etheral-shadow";

export default function EtherealBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <EtherealShadow
        color="rgba(128, 128, 128, 1)"
        animation={{ scale: 100, speed: 100 }}
        noise={{ opacity: 100, scale: 1 }}
        sizing="fill"
        showText={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

