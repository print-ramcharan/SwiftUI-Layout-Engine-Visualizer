import { LayoutNode, LayoutResult, ProposedSize, Size } from './types';

/**
 * The Core Layout Engine.
 * Simulates SwiftUI's parents-propose-children-choose negotiation.
 */

// Helper: Resolve a proposal to a concrete size (providing defaults for nil)
function resolve(proposal: ProposedSize, defaults: Size): Size {
    return {
        width: proposal.width ?? defaults.width,
        height: proposal.height ?? defaults.height,
    };
}

export function sizeThatFits(node: LayoutNode, proposal: ProposedSize): Size {
    switch (node.type) {
        case 'Text':
            // Simulate text sizing: grows with text length, fixed height
            // In a real app we's use Canvas to measure context.
            const length = node.text?.length || 0;
            return {
                width: Math.min(proposal.width ?? 1000, length * 10), // Approx 10px per char
                height: 20,
            };

        case 'Frame':
            // Fixed frame ignores proposal if specified, else adopts proposal
            return {
                width: node.width ?? proposal.width ?? 50,
                height: node.height ?? proposal.height ?? 50,
            };

        case 'Circle':
        case 'Rectangle':
            // Shapes fill the proposed space, or default to 50x50
            return resolve(proposal, { width: 50, height: 50 });

        case 'VStack':
            return layoutVStack(node, proposal).size;

        case 'HStack':
            // TODO: Implement HStack
            return resolve(proposal, { width: 100, height: 100 });

        case 'ZStack':
            // Size is the max size of children
            // TODO: Implement ZStack
            return resolve(proposal, { width: 100, height: 100 });

        default:
            return { width: 50, height: 50 };
    }
}

/**
 * Calculates the full layout tree (sizes and positions)
 */
export function performLayout(node: LayoutNode, proposal: ProposedSize, origin: { x: number, y: number } = { x: 0, y: 0 }): LayoutResult {
    const size = sizeThatFits(node, proposal);

    // If it's a container, we need to recursively layout children
    // Note: This duplicates work from sizeThatFits for efficiency reasons in a real engine we'd cache
    let childrenResults: LayoutResult[] = [];

    if (node.type === 'VStack') {
        const res = layoutVStack(node, proposal);
        childrenResults = res.children;
        // Re-center or position children based on alignment (TODO)
        // For now, layoutVStack returns relative positions, we need to offset by origin
        childrenResults = childrenResults.map(c => ({
            ...c,
            position: { x: c.position.x + origin.x, y: c.position.y + origin.y }
        }));
    }

    return {
        nodeId: node.id,
        size,
        position: origin,
        children: childrenResults
    };
}

// MARK: - Stack Algorithms

/**
 * Simplified VStack Algorithm:
 * 1. Propose width to all children (VStack width).
 * 2. Children choose their height based on that width.
 * 3. Stack them vertically.
 */
function layoutVStack(node: LayoutNode, proposal: ProposedSize): { size: Size, children: LayoutResult[] } {
    const spacing = node.spacing ?? 8;
    const children = node.children;

    if (children.length === 0) {
        return { size: { width: 0, height: 0 }, children: [] };
    }

    // 1. Calculate Sizes
    // In a minimal implementation, VStack proposes its width to children, but unspecified height
    const childProposal = { width: proposal.width, height: null };

    const childSizes = children.map(child => {
        return { id: child.id, size: sizeThatFits(child, childProposal) };
    });

    // 2. Stack them (Calculate Y positions)
    let currentY = 0;
    let maxWidth = 0;
    const positionedChildren: LayoutResult[] = [];

    for (let i = 0; i < children.length; i++) {
        const childNode = children[i];
        const computedSize = childSizes[i].size;

        // Position (centering horizontally by default)
        // We don't know parent width yet completely, but normally Stack takes max width of children
        // unless proposed width is forced.

        positionedChildren.push({
            nodeId: childNode.id,
            size: computedSize,
            position: { x: 0, y: currentY }, // X will be adjusted after we know max width
            children: [] // recursion handled by performLayout usually, but for size calc we stop here
        });

        maxWidth = Math.max(maxWidth, computedSize.width);
        currentY += computedSize.height + (i < children.length - 1 ? spacing : 0);
    }

    // 3. Center Horizontally
    const finalWidth = proposal.width ?? maxWidth; // If parent offers specific width, stack might take it? VStack usually hug content horizontally unless stretched.
    // Actually VStack hugs content horizontally. So maxWidth is correct.
    // Unless proposal.width was mandated?

    positionedChildren.forEach(child => {
        // Center child in the stack's width
        child.position.x = (maxWidth - child.size.width) / 2;
    });

    return {
        size: { width: maxWidth, height: currentY },
        children: positionedChildren
    };
}
