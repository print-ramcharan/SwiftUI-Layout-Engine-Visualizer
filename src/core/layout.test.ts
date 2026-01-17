import { performLayout, sizeThatFits } from './layout';
import { LayoutNode } from './types';

describe('Layout Engine', () => {
    it('calculates size for Text node', () => {
        const node: LayoutNode = { id: '1', type: 'Text', text: 'Hello', children: [] };
        const size = sizeThatFits(node, { width: null, height: null });
        expect(size.width).toBe(50); // 5 chars * 10
        expect(size.height).toBe(20);
    });

    it('layouts a basic VStack', () => {
        const root: LayoutNode = {
            id: 'root',
            type: 'VStack',
            spacing: 10,
            children: [
                { id: 'c1', type: 'Frame', width: 50, height: 50, children: [] },
                { id: 'c2', type: 'Frame', width: 50, height: 50, children: [] }
            ]
        };

        const result = performLayout(root, { width: null, height: null });

        // Total height = 50 + 10 (spacing) + 50 = 110
        expect(result.size.height).toBe(110);
        // Max width = 50
        expect(result.size.width).toBe(50);

        // Check children positions
        expect(result.children[0].position.y).toBe(0);
        expect(result.children[1].position.y).toBe(60); // 50 + 10
    });
});
