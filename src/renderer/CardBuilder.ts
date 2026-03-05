import { NodeData } from "../interfaces";
import { nodeCls, esc, fresh } from "../utils/helpers";

export class CardBuilder {

    public makeCard(
        node: NodeData,
        wc: Record<string, string>,
        UP: Record<string, number>,
        DN: Record<string, number>,
        RI: Record<string, Set<string>>,
        onCardClick: (id: string) => void,
        onHover: (node: NodeData, el: HTMLElement) => void,
        onLeave: () => void
    ): HTMLElement {
        const cls = nodeCls(node.NodeType);
        const wsColor = wc[node.Workspace] || '#6b7fa3';

        const uc = UP[node.NodeId] || 0;
        const dc = DN[node.NodeId] || 0;
        const ic = (RI[node.NodeId] || new Set()).size;

        const impactBadge = node.NodeType !== 'Report' && ic > 0
            ? '<span class="bg bi" title="' + ic + ' reports affected">&#9889;' + ic + '</span>'
            : '';

        const upBadge = uc
            ? '<span class="bg bu" title="' + uc + ' upstream">&#8593;' + uc + '</span>'
            : '';

        const dnBadge = dc
            ? '<span class="bg bd" title="' + dc + ' downstream">&#8595;' + dc + '</span>'
            : '';

        const fr = fresh(node.RefreshTime);
        const fH = fr
            ? '<span class="mi"><span class="fd ' + fr.cssClass + '"></span>' + fr.label + '</span>'
            : '';

        const lH = node.PbiUrl && node.PbiUrl !== ''
            ? '<a class="lnk" href="' + node.PbiUrl + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">&#8599; Open</a>'
            : '';

        const rB = this.rsBar(node.RefreshStatus || '');

        const card = document.createElement('div');
        card.className = 'nc ' + cls;
        card.dataset.id = node.NodeId;

        card.innerHTML =
            '<div class="wt" style="background:' + wsColor + '"></div>' +
            '<div class="cbody">' +
            '<div class="ct2">' +
            '<div class="cnm">' + esc(node.NodeName) + '</div>' +
            '<div class="cbs">' + impactBadge + upBadge + dnBadge + '</div>' +
            '</div>' +
            '<div class="cws" style="color:' + wsColor + '">' + esc(node.Workspace) + '</div>' +
            '<div class="cmt">' + fH + lH + '</div>' +
            '</div>' +
            rB;

        card.addEventListener('mouseenter', () => onHover(node, card));
        card.addEventListener('mouseleave', onLeave);
        card.addEventListener('click', () => onCardClick(node.NodeId));

        return card;
    }

    private rsBar(st: string): string {
        if (st === 'success')
            return '<div class="rs-bar rs-success"><span class="rs-dot"></span>Success</div>';
        if (st === 'failed')
            return '<div class="rs-bar rs-failed"><span class="rs-dot"></span>Failed</div>';
        if (st === 'progress')
            return '<div class="rs-bar rs-progress"><span class="rs-dot"></span>In Progress</div>';
        return '';
    }
}
