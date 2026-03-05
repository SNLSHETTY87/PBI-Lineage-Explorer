import { NodeData, EdgeData, StageInfo } from "../interfaces";
import { computeStages, stageLabel } from "../utils/graphUtils";

export interface StageColumn {
    nodes: NodeData[];
    info: StageInfo;
    index: number;
}

export class LayoutEngine {
    public computeLayout(
        nodes: NodeData[],
        edges: EdgeData[]
    ): StageColumn[] {
        const nIds = new Set(nodes.map(n => n.NodeId));
        const filteredEdges = edges.filter(e => nIds.has(e.SourceId) && nIds.has(e.TargetId));

        const stages = computeStages(nodes, filteredEdges);
        const maxStage = Math.max(0, ...Object.values(stages));

        const byStage: NodeData[][] = [];
        for (let i = 0; i <= maxStage; i++) byStage.push([]);
        nodes.forEach(n => byStage[stages[n.NodeId] || 0].push(n));

        const result: StageColumn[] = [];
        byStage.forEach((sn, idx) => {
            if (!sn.length) return;
            result.push({
                nodes: sn.sort((a, b) => a.NodeName.localeCompare(b.NodeName)),
                info: stageLabel(sn, idx),
                index: idx
            });
        });

        return result;
    }
}
