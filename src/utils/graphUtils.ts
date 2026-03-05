import { NodeData, EdgeData, StageInfo } from "../interfaces";

export function anc(id: string, edges: EdgeData[], visited: Set<string> = new Set()): Set<string> {
    if (visited.has(id)) return new Set();
    visited.add(id);
    const r = new Set<string>();
    edges
        .filter(e => e.TargetId === id)
        .forEach(e => {
            r.add(e.SourceId);
            anc(e.SourceId, edges, visited).forEach(a => r.add(a));
        });
    return r;
}

export function dsc(id: string, edges: EdgeData[], visited: Set<string> = new Set()): Set<string> {
    if (visited.has(id)) return new Set();
    visited.add(id);
    const r = new Set<string>();
    edges
        .filter(e => e.SourceId === id)
        .forEach(e => {
            r.add(e.TargetId);
            dsc(e.TargetId, edges, visited).forEach(d => r.add(d));
        });
    return r;
}

export function precompute(
    nodes: NodeData[],
    edges: EdgeData[]
): { UP: Record<string, number>; DN: Record<string, number>; RI: Record<string, Set<string>> } {
    const UP: Record<string, number> = {};
    const DN: Record<string, number> = {};
    const RI: Record<string, Set<string>> = {};

    nodes.forEach(n => {
        UP[n.NodeId] = edges.filter(e => e.TargetId === n.NodeId).length;
        DN[n.NodeId] = edges.filter(e => e.SourceId === n.NodeId).length;
    });

    nodes.filter(n => n.NodeType !== 'Report').forEach(n => {
        const d = dsc(n.NodeId, edges);
        RI[n.NodeId] = new Set(
            [...d].filter(id => {
                const x = nodes.find(m => m.NodeId === id);
                return x && x.NodeType === 'Report';
            })
        );
    });

    return { UP, DN, RI };
}

export function computeStages(nodes: NodeData[], edges: EdgeData[]): Record<string, number> {
    const stage: Record<string, number> = {};
    nodes.forEach(n => (stage[n.NodeId] = 0));

    const inDeg: Record<string, number> = {};
    nodes.forEach(n => (inDeg[n.NodeId] = 0));

    edges.forEach(e => {
        if (inDeg[e.TargetId] !== undefined) inDeg[e.TargetId]++;
    });

    const queue = nodes
        .filter(n => inDeg[n.NodeId] === 0)
        .map(n => n.NodeId);

    const topo: string[] = [];
    const deg = { ...inDeg };

    while (queue.length) {
        const id = queue.shift()!;
        topo.push(id);
        edges
            .filter(e => e.SourceId === id)
            .forEach(e => {
                deg[e.TargetId]--;
                if (deg[e.TargetId] === 0) queue.push(e.TargetId);
            });
    }

    topo.forEach(id =>
        edges
            .filter(e => e.SourceId === id)
            .forEach(e => {
                if (stage[e.TargetId] < stage[id] + 1)
                    stage[e.TargetId] = stage[id] + 1;
            })
    );

    return stage;
}

export function stageLabel(nodes: NodeData[], idx: number): StageInfo {
    const types = [...new Set(nodes.map(n => n.NodeType))];
    if (types.length === 1) {
        if (types[0] === 'Dataset') return { label: 'Dataset', dotColor: '#34d399' };
        if (types[0] === 'Report') return { label: 'Report', dotColor: '#fb923c' };
        if (types[0] === 'Dataflow') return {
            label: idx === 0 ? 'Source Dataflow' : 'Dataflow L' + (idx + 1),
            dotColor: '#4d9eff'
        };
    }
    return { label: 'Stage ' + (idx + 1), dotColor: '#818cf8' };
}

export function getVisibleNodes(
    nodes: NodeData[],
    edges: EdgeData[],
    selWS: Set<string>,
    selDF: Set<string>,
    selRP: Set<string>,
    searchTerm: string,
    failedOnly: boolean
): NodeData[] {
    let result = nodes;

    if (failedOnly)
        result = result.filter(n => n.RefreshStatus === 'failed');

    if (selWS.size > 0)
        result = result.filter(n => selWS.has(n.Workspace));

    if (selDF.size > 0) {
        const keep = new Set(selDF);
        selDF.forEach(id => {
            anc(id, edges).forEach(a => keep.add(a));
            dsc(id, edges).forEach(d => keep.add(d));
        });
        result = result.filter(n => keep.has(n.NodeId));
    }

    if (selRP.size > 0) {
        const keep = new Set(selRP);
        selRP.forEach(id => {
            anc(id, edges).forEach(a => keep.add(a));
        });
        result = result.filter(n => keep.has(n.NodeId));
    }

    if (searchTerm)
        result = result.filter(n => n.NodeName.toLowerCase().includes(searchTerm));

    return result;
}
