export type ProposedSize = {
    width: number | null;
    height: number | null;
};

export type Size = {
    width: number;
    height: number;
};

export type ViewType = 'VStack' | 'HStack' | 'ZStack' | 'Text' | 'Frame' | 'Circle' | 'Rectangle';

export interface ViewDimensions {
    width: number;
    height: number;
}

export interface LayoutNode {
    id: string;
    type: ViewType;
    children: LayoutNode[];

    // Properties specifics
    text?: string;
    color?: string;
    spacing?: number; // for stacks
    padding?: number;

    // Layout Props (Fixed frame etc)
    width?: number | null;
    height?: number | null;
}

export interface LayoutResult {
    nodeId: string;
    size: Size;
    position: { x: number, y: number };
    children: LayoutResult[];
}
