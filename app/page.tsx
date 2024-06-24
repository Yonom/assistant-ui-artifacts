"use client";

import { Thread } from "@/components/ui/assistant-ui/thread";
import { ArtifactsView } from "./ArtifactsView";

export default function Home() {
  return (
    <main className="h-full flex justify-stretch">
      <Thread />
      <ArtifactsView />
    </main>
  );
}
