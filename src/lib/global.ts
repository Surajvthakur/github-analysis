const GITHUB_API = "https://api.github.com";
const REVALIDATE_TIME = 60 * 60 * 6; // 6 hours

async function githubFetch(url: string) {
    const token = process.env.GITHUB_TOKEN;

    const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: REVALIDATE_TIME },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API error ${res.status}: ${text}`);
    }

    return res.json();
}

/* -------------------------------------------------
   TRENDING REPOSITORIES (RELEVANCE-BASED)
-------------------------------------------------- */

export async function getTrendingRepos(limit = 10) {
    // Fetch high-star repos updated recently (proxy for activity)
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const query = [
        "stars:>10000",
        `pushed:>${since.toISOString().split("T")[0]}`,
    ].join(" ");

    const data = await githubFetch(
        `${GITHUB_API}/search/repositories?q=${encodeURIComponent(
            query
        )}&sort=stars&order=desc&per_page=${limit}`
    );

    return data.items.map((repo: any) => ({
        name: repo.full_name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
        updated_at: repo.updated_at,
    }));
}

/* -------------------------------------------------
   LANGUAGE POPULARITY (GLOBAL)
-------------------------------------------------- */

export async function getLanguageStats() {
    // Fetch top repositories to extract languages dynamically
    const repoData = await githubFetch(
        `${GITHUB_API}/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=100`
    );

    // Aggregate languages from top repositories
    const languageMap: Record<string, { repoCount: number; totalStars: number }> = {};

    for (const repo of repoData.items) {
        const lang = repo.language;
        if (!lang) continue;

        if (!languageMap[lang]) {
            languageMap[lang] = { repoCount: 0, totalStars: 0 };
        }
        languageMap[lang].repoCount += 1;
        languageMap[lang].totalStars += repo.stargazers_count || 0;
    }

    // Convert to array and sort by repo count
    const languages = Object.entries(languageMap)
        .map(([language, stats]) => ({
            language,
            repoCount: stats.repoCount,
            totalStars: stats.totalStars,
        }))
        .sort((a, b) => b.repoCount - a.repoCount);

    return languages;
}

/* -------------------------------------------------
   GLOBAL DASHBOARD SUMMARY
-------------------------------------------------- */

export async function getGlobalDashboard() {
    const [trending, languages] = await Promise.all([
        getTrendingRepos(5),
        getLanguageStats(),
    ]);

    return {
        trending,
        languages,
        insights: generateInsights(trending, languages),
    };
}

/* -------------------------------------------------
   INSIGHTS (RULE-BASED)
-------------------------------------------------- */

function generateInsights(trending: any[], languages: any[]) {
    const topLang = languages.sort(
        (a, b) => b.repoCount - a.repoCount
    )[0];

    const hottestRepo = trending[0];

    return [
        {
            title: "Most Popular Language",
            value: topLang.language,
            description: `${topLang.language} dominates GitHub by repository count.`,
        },
        {
            title: "Hottest Repository",
            value: hottestRepo.name,
            description: `This repo leads the charts with ${hottestRepo.stars.toLocaleString()} stars.`,
        },
    ];
}
/* -------------------------------------------------
   REPOSITORY ANALYTICS (SINGLE REPO)
-------------------------------------------------- */

export async function getRepoStats(repoFullName: string) {
    // repoFullName format: owner/repo
    if (!repoFullName.includes("/")) {
        throw new Error("Invalid repository name format");
    }

    const data = await githubFetch(
        `${GITHUB_API}/repos/${repoFullName}`
    );

    return {
        name: data.full_name,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        watchers: data.subscribers_count,
        updatedAt: data.updated_at,
        sizeKB: data.size,
        language: data.language,
        url: data.html_url,
        description: data.description,
    };
}
