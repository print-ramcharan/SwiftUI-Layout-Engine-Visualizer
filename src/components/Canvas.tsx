'use client';
import { useState, useEffect } from 'react';
import { performLayout } from '@/core/layout';
import { LayoutNode, LayoutResult } from '@/core/types';
import { NodeView } from './NodeView';
import { ArrowLeft, ArrowRight, Play, SquareTerminal } from 'lucide-react';

const INITIAL_TREE: LayoutNode = {
    id: 'root',
    type: 'VStack',
    spacing: 10,
    children: [
        { id: '1', type: 'Text', text: 'Hello World', children: [] },
        { id: '2', type: 'Frame', width: 100, height: 50, color: '#F00', children: [] },
        { id: '3', type: 'Text', text: 'SwiftUI Layout', children: [] }
    ]
};

export const Canvas = () => {
    const [tree, setTree] = useState<LayoutNode>(INITIAL_TREE);
    const [layoutResult, setLayoutResult] = useState<LayoutResult | null>(null);
    const [containerSize, setContainerSize] = useState({ width: 300, height: 500 });

    // Re-run layout when tree or container changes
    useEffect(() => {
        const res = performLayout(tree, { width: containerSize.width, height: containerSize.height });
        setLayoutResult(res);
    }, [tree, containerSize]);

    if (!layoutResult) return <div>Computing Layout...</div>;

    return (
        <div className="flex flex-col h-full w-full bg-neutral-900 text-white">
            {/* Toolbar */}
            <div className="h-12 border-b border-neutral-800 flex items-center px-4 space-x-4">
                <span className="font-bold flex items-center gap-2">
                    <SquareTerminal size={16} /> SwiftUI Visualizer
                </span>
                <div className="flex-1" />
                <div className="text-xs text-neutral-400">
                    Container: {containerSize.width}x{containerSize.height}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Canvas Area */}
                <div className="flex-1 bg-neutral-950 relative flex items-center justify-center p-10">

                    {/* Draggable Container Handle (Simulator Device) */}
                    <div
                        className="border-2 border-dashed border-neutral-700 relative bg-neutral-900 shadow-2xl transition-all duration-300"
                        style={{ width: containerSize.width, height: containerSize.height }}
                    >
                        {/* Root Node Render */}
                        <NodeView node={layoutResult} />

                        {/* Resize Handle */}
                        <div
                            className="absolute right-[-10px] bottom-[-10px] w-6 h-6 bg-blue-500 rounded-full cursor-se-resize shadow-md hover:scale-110 transition-transform"
                            onMouseDown={(e) => {
                                // Simple drag implementation
                                const startX = e.clientX;
                                const startY = e.clientY;
                                const startW = containerSize.width;
                                const startH = containerSize.height;

                                const handleMove = (ev: MouseEvent) => {
                                    setContainerSize({
                                        width: Math.max(100, startW + (ev.clientX - startX)),
                                        height: Math.max(100, startH + (ev.clientY - startY))
                                    });
                                };
                                const handleUp = () => {
                                    window.removeEventListener('mousemove', handleMove);
                                    window.removeEventListener('mouseup', handleUp);
                                };
                                window.addEventListener('mousemove', handleMove);
                                window.addEventListener('mouseup', handleUp);
                            }}
                        />
                    </div>
                </div>

                {/* Sidebar Inspector (Placeholder) */}
                <div className="w-64 border-l border-neutral-800 bg-neutral-900 p-4">
                    <h2 className="text-sm font-bold mb-4">Inspector</h2>
                    <div className="text-xs text-neutral-500">
                        Select a node to inspect properties.
                        <br /><br />
                        (Coming Soon)
                    </div>
                </div>
            </div>
        </div>
    );
};
