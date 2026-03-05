import { NodeData } from "../interfaces";
import { nodeColor, fresh } from "../utils/helpers";

export class TooltipManager {
    private ttEl: HTMLElement;
    private ttTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(ttEl: HTMLElement) {
        this.ttEl = ttEl;
    }

    public show(
        node: NodeData,
        cardEl: HTMLElement,
        UP: Record<string, number>,
        DN: Record<string, number>
    ): void {
        this.hide();
        this.ttTimer = setTimeout(() => {
            if (!this.ttEl) return;

            const col = nodeColor(node.NodeType);

            const ttNm = this.ttEl.querySelector('#tt-nm') as HTMLElement;
            if (ttNm) ttNm.textContent = node.NodeName;

            const ttType = this.ttEl.querySelector('#tt-type') as HTMLElement;
            if (ttType) ttType.innerHTML =
                '<span class="tt-dot" style="background:' + col + '"></span>' +
                node.NodeType + ' &middot; ' + node.Workspace;

            const fr = fresh(node.RefreshTime);
            const ttRef = this.ttEl.querySelector('#tt-ref') as HTMLElement;
            if (ttRef) ttRef.innerHTML = fr
                ? '<span class="tt-dot" style="background:#94a3c4"></span>' + fr.label
                : '';

            const rs = node.RefreshStatus || '';
            const ttSt = this.ttEl.querySelector('#tt-st') as HTMLElement;
            if (ttSt) {
                if (rs) {
                    const rc = rs === 'success' ? '#34d399' : rs === 'failed' ? '#f472b6' : '#fbbf24';
                    const rl = rs === 'success' ? '&#10003; Success' : rs === 'failed' ? '&#10007; Failed' : '&#8635; In Progress';
                    ttSt.innerHTML =
                        '<span class="tt-dot" style="background:' + rc + '"></span>' +
                        '<span style="color:' + rc + ';font-weight:600">' + rl + '</span>';
                } else {
                    ttSt.innerHTML = '';
                }
            }

            const up = UP[node.NodeId] || 0;
            const dn = DN[node.NodeId] || 0;
            const ttCh = this.ttEl.querySelector('#tt-ch') as HTMLElement;
            if (ttCh) ttCh.innerHTML =
                '<span class="tt-dot" style="background:#4a5878"></span>' +
                '&#8593;' + up + ' upstream &middot; &#8595;' + dn + ' downstream';

            const r = cardEl.getBoundingClientRect();
            this.ttEl.style.left = (r.right + 8) + 'px';
            this.ttEl.style.top = r.top + 'px';
            this.ttEl.classList.add('show');

            setTimeout(() => {
                const tr = this.ttEl.getBoundingClientRect();
                if (tr.right > window.innerWidth - 8)
                    this.ttEl.style.left = (r.left - tr.width - 8) + 'px';
                if (tr.bottom > window.innerHeight - 8)
                    this.ttEl.style.top = (window.innerHeight - tr.height - 8) + 'px';
            }, 0);
        }, 350);
    }

    public hide(): void {
        if (this.ttTimer) {
            clearTimeout(this.ttTimer);
            this.ttTimer = null;
        }
        if (this.ttEl) this.ttEl.classList.remove('show');
    }
}
