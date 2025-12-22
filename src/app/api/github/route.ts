import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const type = searchParams.get("type") || "user";

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  let url = "";

  if (type === "repos") {
    url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
  } else if (type === "events") {
    url = `https://api.github.com/users/${username}/events/public?per_page=30`;
  } else {
    url = `https://api.github.com/users/${username}`;
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 }, // ISR caching
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`GitHub API error: ${response.status} - ${errorText}`);
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: "GitHub user not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `GitHub API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GitHub API route:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}