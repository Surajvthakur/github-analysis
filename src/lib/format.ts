// Use a fixed locale to prevent hydration mismatch between server and client
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

// Format bytes to human readable
export const formatBytes = (bytes: number): string => {
    if (bytes >= 1_000_000_000) {
        return `${(bytes / 1_000_000_000).toFixed(1)}B`;
    }
    if (bytes >= 1_000_000) {
        return `${(bytes / 1_000_000).toFixed(1)}M`;
    }
    if (bytes >= 1_000) {
        return `${(bytes / 1_000).toFixed(1)}K`;
    }
    return bytes.toString();
};
