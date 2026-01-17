'use client';
import { LayoutResult } from '@/core/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NodeViewProps {
    node: LayoutResult;
    selectedId?: string | null;
    onSelect: (id: string) => void;
    depth?: number;
}

export const NodeView = ({ node, selectedId, onSelect, depth = 0 }: NodeViewProps) => {
    // Prevent click propagation
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(node.nodeId);
    };

    const isSelected = selectedId === node.nodeId;

    return (
        <motion.div
            layout
            onClick={handleClick}
            className={cn(
                "absolute transition-all cursor-pointer",
                // Base styles
                "flex items-center justify-center text-xs font-mono",
                // Bounding box style
                isSelected
                    ? "border-2 border-yellow-400 bg-yellow-500/20 z-50 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                    : "border border-blue-500/30 bg-blue-500/5 hover:border-blue-400/60"
            )}
            style={{
                width: node.size.width,
                height: node.size.height,
                left: node.position.x,
                top: node.position.y,
                zIndex: depth, // Base z-index by depth
            }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
        >
            {/* Node Label */}
            <div className={cn(
                "absolute -top-4 left-0 px-1 text-[9px] whitespace-nowrap rounded",
                isSelected ? "bg-yellow-400 text-black font-bold" : "bg-black/50 text-blue-200"
            )}>
                {node.nodeId} <span className="opacity-70">({node.size.width.toFixed(0)}×{node.size.height.toFixed(0)})</span>
            </div>

            {/* Children */}
            {node.children.map(child => (
                <NodeView
                    key={child.nodeId}
                    node={child}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    depth={depth + 1}
                />
            ))}
        </motion.div>
    );
};
