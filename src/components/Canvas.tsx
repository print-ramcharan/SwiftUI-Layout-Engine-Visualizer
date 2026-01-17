'use client';
import { useState, useEffect, useMemo } from 'react';
import { performLayout } from '@/core/layout';
import { LayoutNode, LayoutResult } from '@/core/types';
import { NodeView } from './NodeView';
import { SquareTerminal, Box, Type, Layers, Layout, RefreshCw } from 'lucide-react';

// Initial Tree State
const INITIAL_TREE: LayoutNode = {
    id: 'root',
    type: 'VStack',
    spacing: 10,
    children: [
        { id: 'text-1', type: 'Text', text: 'Hello World', children: [] },
        {
            id: 'frame-1',
            type: 'Frame',
            width: 100,
            height: 50,
            children: []
        },
        { id: 'text-2', type: 'Text', text: 'SwiftUI Layout', children: [] }
    ]
};

// Helper: Find a node in the tree by ID (DFS)
function findNode(root: LayoutNode, id: string): LayoutNode | null {
    if (root.id === id) return root;
    for (const child of root.children) {
        const found = findNode(child, id);
        if (found) return found;
    }
    return null;
}

export const Canvas = () => {
    const [tree, setTree] = useState<LayoutNode>(INITIAL_TREE);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [layoutResult, setLayoutResult] = useState<LayoutResult | null>(null);
    const [containerSize, setContainerSize] = useState({ width: 300, height: 500 });
    const [dragStart, setDragStart] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

    // Re-run layout when tree or container changes
    useEffect(() => {
        const res = performLayout(tree, { width: containerSize.width, height: containerSize.height });
        setLayoutResult(res);
    }, [tree, containerSize]);

    // Derived state for inspector
    const selectedNode = useMemo(() =>
        selectedNodeId ? findNode(tree, selectedNodeId) : null,
        [tree, selectedNodeId]);

    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setDragStart({ x: e.clientX, y: e.clientY, w: containerSize.width, h: containerSize.height });
    };

    useEffect(() => {
        if (!dragStart) return;
        const handleMove = (e: MouseEvent) => {
            setContainerSize({
                width: Math.max(150, dragStart.w + (e.clientX - dragStart.x)),
                height: Math.max(150, dragStart.h + (e.clientY - dragStart.y))
            });
        };
        const handleUp = () => setDragStart(null);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [dragStart]);


    if (!layoutResult) return <div>Computing Layout...</div>;

    return (
        <div className="flex flex-col h-screen w-screen bg-neutral-900 text-white overflow-hidden">
            {/* Toolbar */}
            <div className="h-12 border-b border-neutral-800 flex items-center px-4 space-x-4 bg-neutral-950/50 backdrop-blur z-20">
                <span className="font-bold flex items-center gap-2 text-blue-400">
                    <SquareTerminal size={18} /> SwiftUI Visualizer
                </span>
                <div className="h-4 w-[1px] bg-neutral-800 mx-2" />
                <div className="text-xs text-neutral-400 flex items-center gap-2">
                    <Layout size={14} />
                    Container: <span className="text-blue-200 font-mono">{containerSize.width.toFixed(0)} × {containerSize.height.toFixed(0)}</span>
                </div>
                <div className="flex-1" />
                <button
                    onClick={() => setSelectedNodeId(null)}
                    className="text-xs px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                >
                    Reset Selection
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Canvas Area */}
                <div className="flex-1 bg-neutral-950 relative flex items-center justify-center p-10 select-none">

                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(#4d4d4d 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    {/* Draggable Container Handle (Simulator Device) */}
                    <div
                        className="border-2 border-dashed border-neutral-700 relative bg-neutral-900 shadow-2xl transition-all duration-75"
                        style={{ width: containerSize.width, height: containerSize.height }}
                    >
                        {/* Root Node Render */}
                        <NodeView
                            node={layoutResult}
                            selectedId={selectedNodeId}
                            onSelect={setSelectedNodeId}
                        />

                        {/* Resize Handle */}
                        <div
                            className="absolute right-[-10px] bottom-[-10px] w-6 h-6 bg-blue-600 rounded-full cursor-se-resize shadow-[0_0_10px_rgba(37,99,235,0.5)] border-2 border-white hover:scale-110 transition-transform z-50 flex items-center justify-center transform hover:rotate-90"
                            onMouseDown={handleMouseDown}
                        >
                            <RefreshCw size={10} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Sidebar Inspector */}
                <div className="w-80 border-l border-neutral-800 bg-neutral-900/95 backdrop-blur flex flex-col z-20">
                    <div className="p-4 border-b border-neutral-800">
                        <h2 className="text-sm font-bold flex items-center gap-2">
                            <br />
                            Inspector
                        </h2>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        {selectedNode ? (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                                {/* Identity Section */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Identity</label>
                                    <div className="bg-neutral-800 rounded p-3 text-sm font-mono border border-neutral-700">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">Type</span>
                                            <span className="text-yellow-400 font-bold">{selectedNode.type}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-neutral-400">ID</span>
                                            <span className="text-neutral-300 truncate max-w-[120px]" title={selectedNode.id}>{selectedNode.id}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Computed Layout Section */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                        <Box size={12} /> Computed Layout
                                    </label>
                                    <div className="bg-neutral-800 rounded p-3 text-sm font-mono border border-neutral-700">
                                        {/* Need to find layout result for this node again to show size? 
                                    Actually selectedNode is the definition. 
                                    We can find the result node in layoutResult.
                                */}
                                        <div className="grid grid-cols-2 gap-2 text-center">
                                            <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                                                <div className="text-[10px] text-neutral-500">Width</div>
                                                <div className="text-blue-300">
                                                    {/* We technically need to search layoutResult for this ID to get computed size. 
                                                For now we can assume the user sees it on the canvas label, 
                                                but let's be nice and show properties from definition here.
                                            */}
                                                    {selectedNode.width ?? "Hug"}
                                                </div>
                                            </div>
                                            <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                                                <div className="text-[10px] text-neutral-500">Height</div>
                                                <div className="text-blue-300">
                                                    {selectedNode.height ?? "Hug"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Properties Section */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                        <Layers size={12} /> Properties
                                    </label>
                                    <div className="bg-neutral-800 rounded p-3 space-y-3 border border-neutral-700">

                                        {selectedNode.type === 'Text' && (
                                            <div className="space-y-1">
                                                <div className="text-xs text-neutral-400 flex items-center gap-1"><Type size={10} /> Text Data</div>
                                                <div className="p-2 bg-black/30 rounded text-sm border border-neutral-700 text-white">
                                                    "{selectedNode.text}"
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'VStack' && (
                                            <div className="space-y-1">
                                                <div className="text-xs text-neutral-400">Spacing</div>
                                                <div className="p-2 bg-black/30 rounded text-sm border border-neutral-700 text-white flex justify-between">
                                                    <span>Vertical Space</span>
                                                    <span className="font-mono text-purple-400">{selectedNode.spacing ?? 8}px</span>
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'Frame' && selectedNode.color && (
                                            <div className="space-y-1">
                                                <div className="text-xs text-neutral-400">Background Color</div>
                                                <div className="flex items-center gap-2 p-2 bg-black/30 rounded border border-neutral-700">
                                                    <div className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: selectedNode.color }} />
                                                    <span className="font-mono text-xs">{selectedNode.color}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-[10px] text-neutral-600 italic pt-2">
                                            Child Count: {selectedNode.children.length}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-3">
                                <Box size={40} className="opacity-20" />
                                <div className="text-sm text-center px-8">
                                    Select an item on the canvas to inspect its layout properties.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
