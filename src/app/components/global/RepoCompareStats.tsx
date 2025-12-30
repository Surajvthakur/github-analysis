interface Repo {
    stars: number;
    forks: number;
    openIssues: number;
    watchers: number;
}

function StatRow({
    label,
    left,
    right,
}: {
    label: string;
    left: number;
    right: number;
}) {
    const leftWins = left > right;
    const rightWins = right > left;

    return (
        <div className="grid grid-cols-3 border-b py-3 text-sm">
            <span
                className={`text-center ${leftWins && "font-bold text-green-600"
                    }`}
            >
                {left.toLocaleString()}
            </span>

            <span className="text-center font-medium">
                {label}
            </span>

            <span
                className={`text-center ${rightWins && "font-bold text-green-600"
                    }`}
            >
                {right.toLocaleString()}
            </span>
        </div>
    );
}

export default function RepoCompareStats({
    left,
    right,
}: {
    left: Repo;
    right: Repo;
}) {
    return (
        <div className="border rounded-xl overflow-hidden">
            <StatRow
                label="Stars"
                left={left.stars}
                right={right.stars}
            />
            <StatRow
                label="Forks"
                left={left.forks}
                right={right.forks}
            />
            <StatRow
                label="Open Issues"
                left={left.openIssues}
                right={right.openIssues}
            />
            <StatRow
                label="Watchers"
                left={left.watchers}
                right={right.watchers}
            />
        </div>
    );
}
