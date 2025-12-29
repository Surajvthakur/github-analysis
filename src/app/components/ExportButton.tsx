"use client";

interface ExportButtonProps {
  elementId?: string;
  filename?: string;
  title?: string;
}

export default function ExportButton({
  elementId = "dashboard",
  filename = "github-analytics",
  title = "GitHub Analytics Report",
}: ExportButtonProps) {
  // Export functionality removed
  return null;
}
