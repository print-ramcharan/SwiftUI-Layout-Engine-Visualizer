import { Terminal } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-neutral-900 text-white">
      <div className="flex flex-col items-center space-y-4">
        <Terminal size={64} className="text-blue-500" />
        <h1 className="text-4xl font-bold tracking-tighter">SwiftUI Layout Visualizer</h1>
        <p className="text-neutral-400">Initializing Core Engine...</p>
      </div>
    </main>
  );
}
