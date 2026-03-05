export interface NodeData {
    NodeId: string;
    NodeName: string;
    NodeType: string; // 'Dataflow' | 'Dataset' | 'Report'
    Workspace: string;
    RefreshTime: string;
    RefreshStatus: string; // 'success' | 'failed' | 'progress' | ''
    PbiUrl: string;
}

export interface EdgeData {
    SourceId: string;
    Source: string;
    TargetId: string;
    Target: string;
}

export interface FreshnessInfo {
    cssClass: string; // 'fo' | 'fw' | 'fs'
    label: string;
}

export interface StageInfo {
    label: string;
    dotColor: string;
}

export interface PrecomputedData {
    UP: Record<string, number>;
    DN: Record<string, number>;
    RI: Record<string, Set<string>>;
    WC: Record<string, string>;
}

export interface FilterState {
    selWS: Set<string>;
    selDF: Set<string>;
    selRP: Set<string>;
    searchTerm: string;
    failedOnly: boolean;
}
