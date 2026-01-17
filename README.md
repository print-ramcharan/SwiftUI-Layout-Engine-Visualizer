# SwiftUI Layout Engine Visualizer

> **Interactive Educational Tool**
> A web-based visualizer that reverse-engineers and demonstrates SwiftUI's layout algorithm.

---

## 🎯 The Goal
SwiftUI's layout system is a "black box" to many developers.
This project **re-implements the core layout protocol** in TypeScript to visualize exactly how parents and children negotiate size.

**The Algorithm:**
1.  **Proposal**: Parent offers a size (Visualized as a Red Dashed Box).
2.  **Choice**: Child chooses its own size based on the proposal (Visualized as a Blue Box).
3.  **Placement**: Parent positions the child.

## 🛠️ Tech Stack
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion (for smooth layout transitions)
-   **Core Logic**: TypeScript (Pure implementation of `sizeThatFits`)

---

## 🚀 How to Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```

3.  **Open in Browser**
    Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Verification
The layout engine logic is verified with Jest unit tests.

```bash
npm test
```

## 📂 Architecture

-   [`src/core/layout.ts`](src/core/layout.ts): The "Brain". Contains `sizeThatFits` and `performLayout`.
-   [`src/components/Canvas.tsx`](src/components/Canvas.tsx): The interactive playground.
-   [`src/components/NodeView.tsx`](src/components/NodeView.tsx): Recursive component that renders the layout tree.

See [WALKTHROUGH.md](WALKTHROUGH.md) for a detailed breakdown of the implementation.
