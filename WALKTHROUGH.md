# Walkthrough: SwiftUI Layout Visualizer (Web)

I have successfully built **Project 2: SwiftUI Layout Visualizer**, an interactive educational tool running on the web (Next.js).

## Goal Achievement
The goal was to demonstrate deep understanding of SwiftUI's layout algorithm.
We achieved this by **re-implementing the layout engine in TypeScript** and visualizing it.

## Key Components

### 1. The Layout Engine Core
Located in [`src/core/layout.ts`](src/core/layout.ts).
This is the "Brain". It implements:
- `sizeThatFits(proposal)`: The fundamental negotiation method.
- `layoutVStack`: A simplified implementation of SwiftUI's vertical stack logic (propose width -> child chooses height -> stack vertically).

### 2. Interactive Canvas & Inspector
Located in [`src/components/Canvas.tsx`](src/components/Canvas.tsx).
This is the main playground. It:
- **Layout Tree**: Renders the nested view hierarchy.
- **Resize Simulator**: Allows resizing the "Device Container" to see how the layout adapts in real-time.
- **Node Selection**: Click any view (Text, Frame, Stack) to inspect it.
- **Inspector Panel**: Shows the selected node's type, computed size, and internal properties (spacing, text content, color).

### 3. Recursive Rendering with Animations
Located in [`src/components/NodeView.tsx`](src/components/NodeView.tsx).
- Uses **Framer Motion** (`layout` prop) to automatically animate changes.
- Highlight selected nodes with a custom glow effect.

## Verification
- [x] **Core Logic**: Verified via Jest unit tests (`npm test`).
- [x] **Production Build**: Verified via `npm run build` (Next.js App Router).
- [x] **Interaction**: Verified that clicking nodes updates the Inspector panel.

## How to Run
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`
