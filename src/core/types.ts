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
    // In a real engine, we'd have alignment guides here
}

export interface LayoutNode {
    id: string;
    type: ViewType;
    children: LayoutNode[];

    // Properties specific to types
    text?: string;
    color?: string;
    spacing?: number; // for stacks
    padding?: number;

    // The layout Logic
    sizeThatFits(proposal: ProposedSize): Size;
    placeSubviews(inBounds: Size): void;
}
