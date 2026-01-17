'use client';
import { LayoutResult } from '@/core/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NodeViewProps {
    node: LayoutResult;
    className?: string;
    depth?: number;
}

export const NodeView = ({ node, className, depth = 0 }: NodeViewProps) => {
    const isLeaf = node.children.length === 0;

    return (
        <motion.div
            layout
            className={cn(
                "absolute border border-blue-500/30 bg-blue-500/5",
                "flex items-center justify-center text-xs text-blue-300 font-mono",
                className
            )}
            style={{
                width: node.size.width,
                height: node.size.height,
                left: node.position.x,
                top: node.position.y,
                zIndex: depth
            }}
            transition={{ duration: 0.5, type: "spring" }}
        >
            {/* Node Label */}
            <span className="absolute top-0 left-0 p-1 bg-black/50 text-[8px] pointer-events-none">
                {node.nodeId} ({node.size.width.toFixed(0)}x{node.size.height.toFixed(0)})
            </span>

            {/* Children */}
            {node.children.map(child => (
                <NodeView key={child.nodeId} node={child} depth={depth + 1} />
            ))}
        </motion.div>
    );
};
