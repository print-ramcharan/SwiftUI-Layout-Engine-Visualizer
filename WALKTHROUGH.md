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

### 2. Interactive Canvas
Located in [`src/components/Canvas.tsx`](src/components/Canvas.tsx).
This is the main playground. It:
- Renders the `LayoutNode` tree using `NodeView`.
- Allows resizing the "Device Container" to see how the layout adapts in real-time.
- Shows the computed size and position of every view.

### 3. Recursive Rendering with Animations
Located in [`src/components/NodeView.tsx`](src/components/NodeView.tsx).
- Uses **Framer Motion** (`layout` prop) to automatically animate changes.
- If you resize the container, the Text and Frames slide into their new positions smoothly, mimicking SwiftUI's animation system.

## Verification
- [x] **Core Logic**: Verified via Jest unit tests (`npm test`).
- [x] **Production Build**: Verified via `npm run build` (Next.js App Router).
- [x] **Visuals**: The `Canvas` component correctly renders the recursive tree structure.

## How to Run
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`
