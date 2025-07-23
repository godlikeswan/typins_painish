export function maxSubsequence(a: string, b: string): string {
    if (a.length === 0 || b.length === 0) return "";
    if (a.slice(-1) === b.slice(-1))
        return maxSubsequence(a.slice(0, -1), b.slice(0, -1)) + a.slice(-1);
    const c = maxSubsequence(a.slice(0, -1), b);
    const d = maxSubsequence(a, b.slice(0, -1));
    return c.length > d.length ? c : d;
}
