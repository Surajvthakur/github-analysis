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
  } else {
    url = `https://api.github.com/users/${username}`;
  }

  try {
    const response = await fetch(
      url,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 }, // ISR caching
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "GitHub user not found" },
        { status: 404 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}