import { NextResponse } from "next/server";
import {
  getTrendingRepos,
  getLanguageStats,
  getGlobalDashboard,
} from "@/lib/global";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "dashboard";

  try {
    switch (type) {
      case "trending":
        return NextResponse.json({
          repos: await getTrendingRepos(),
        });

      case "languages":
        return NextResponse.json({
          languages: await getLanguageStats(),
        });

      case "dashboard":
        return NextResponse.json(
          await getGlobalDashboard()
        );

      default:
        return NextResponse.json(
          { error: "Invalid global analytics type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Global API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch global analytics" },
      { status: 500 }
    );
  }
}
