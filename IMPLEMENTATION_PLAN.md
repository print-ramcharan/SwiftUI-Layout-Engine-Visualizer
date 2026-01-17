# Implementation Plan - SwiftUI Layout Visualizer (Web)

> [!IMPORTANT]
> **Why Web?**
> Since Xcode is unavailable, we are building this as a **Next.js Web Application**.
> This allows you to verify the visual output and provides a shareable link for recruiters.

# Goal Description
Build an **interactive educational tool** that visualizes how SwiftUI's layout system works.
The tool will simulate the `Parent Proposes Size` -> `Child Chooses Size` protocol in real-time.

## User Review Required
- **Tech Stack**: Next.js 14, Tailwind CSS, Framer Motion (for smooth layout transitions).
- **Scope**: We will stick to core layout primitives (`VStack`, `HStack`, `ZStack`, `Text`, `Frame`, `Padding`).

## Proposed Changes

### Project Structure
- `swiftui-layout-visualizer/` (Root)
    - `src/`
        - `core/` -> The TypeScript implementation of SwiftUI's layout engine.
            - `types.ts` (View protocols)
            - `layout.ts` (The layout algorithm)
        - `components/`
            - `Canvas.tsx` (Where views are drawn)
            - `NodeView.tsx` (The recursive renderer)
            - `DebugOverlay.tsx` (The arrows and dimensions)

### Layout Engine Core
We will rewrite SwiftUI's logic in TypeScript. See [src/core/layout.ts](src/core/layout.ts).

### Interactive Features
1.  **Tree Builder**: Sidebar to add views to the tree.
2.  **Live Visuals**:
    - **Blue Box**: The computed size of the view.
    - **Red Dashed Box**: The size proposed by the parent.
    - **Animations**: Slow down the layout pass to see it happen step-by-step.

## Verification Plan

### Automated Tests
- Jest unit tests for the layout engine (e.g., verifying `HStack` correctly divides space among children).
- Run with `npm test`.

### Manual Verification
- We will run `npm run dev` and interact with the UI in the browser.
- Production build verified with `npm run build`.
