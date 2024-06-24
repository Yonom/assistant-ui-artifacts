"use client";

import { makeAssistantTool, Thread } from "@assistant-ui/react";
import { ArtifactsView } from "./ArtifactsView";
import { MarkdownText } from "./syntax-highlighter";
import { TerminalIcon } from "lucide-react";
import { z } from "zod";

const RenderHTMLTool = makeAssistantTool({
  toolName: "render_html",
  description:
    "Whenever the user asks for HTML code, call this function. The user will see the HTML code rendered in their browser.",
  parameters: z.object({
    code: z.string(),
  }),
  execute: async () => {
    return {};
  },
  render: () => {
    return (
      <div className="border rounded-full px-4 py-2 -mt-2 bg-black text-white inline-flex items-center gap-2">
        <TerminalIcon className="size-4" />
        render_html({"{"} code: &quot;...&quot; {"}"})
      </div>
    );
  },
});

export default function Home() {
  return (
    <main className="h-full flex justify-stretch">
      <div className="flex-grow basis-full">
        <Thread assistantMessage={{ components: { Text: MarkdownText } }} />
      </div>
      <RenderHTMLTool />
      <ArtifactsView />
    </main>
  );
}
