import { FreshnessInfo } from "../interfaces";

const WS_PALETTE: string[] = [
    '#818cf8', '#34d399', '#fb923c', '#f472b6', '#a78bfa', '#60a5fa', '#fbbf24'
];

export function getWsPalette(): string[] {
    return WS_PALETTE;
}

export function nodeColor(t: string): string {
    return t === 'Dataflow' ? '#4d9eff'
        : t === 'Dataset' ? '#34d399'
            : '#fb923c';
}

export function nodeCls(t: string): string {
    return t === 'Dataflow' ? 'df'
        : t === 'Dataset' ? 'ds'
            : 'rp';
}

export function esc(s: string): string {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function fresh(t: string): FreshnessInfo | null {
    if (!t) return null;
    const d = new Date(t);
    if (isNaN(d.getTime())) return null;
    const h = (Date.now() - d.getTime()) / 3600000;
    const rel = h < 24
        ? (h < 1 ? '<1h ago' : Math.floor(h) + 'h ago')
        : Math.floor(h / 24) + 'd ago';
    const c = h < 24 ? 'fo' : h < 168 ? 'fw' : 'fs';
    return {
        cssClass: c,
        label: rel + ' (' +
            d.toLocaleDateString() + ', ' +
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
            ')'
    };
}

export function fdSpan(c: string, l: string): string {
    return '<span class="mi"><span class="fd ' + c + '"></span>' + l + '</span>';
}

export function fdDot(c: string): string {
    return '<span class="fd ' + c + '"></span>';
}

export function initWorkspaceColors(workspaces: string[]): Record<string, string> {
    const wc: Record<string, string> = {};
    [...new Set(workspaces)].sort().forEach((w, i) => {
        wc[w] = WS_PALETTE[i % WS_PALETTE.length];
    });
    return wc;
}
