"use client";
import {
  useAssistantTool,
  useThreadContext,
} from "@assistant-ui/react/experimental";
import { TerminalIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import z from "zod";
import { generateCode } from "./MyRuntimeProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ArtifactsView = () => {
  const { useThread } = useThreadContext();
  const isRunningRef = useRef(false);
  const [artifact, setArtifact] = useState<null | string>(null);

  useAssistantTool({
    toolName: "render_html",
    description:
      "Whenever the user asks for HTML code, call this function. You will then be prompted to generate the HTML code in a second step. Do not call this function multiple times in a row.",
    parameters: z.object({}),
    execute: async () => {
      try {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        return {
          code: await generateCode(useThread.getState().messages, setArtifact),
        };
      } finally {
        isRunningRef.current = false;
      }
    },
    render: useCallback(() => {
      return (
        <div className="border rounded-full px-4 py-2 -mt-2 bg-black text-white inline-flex items-center gap-2">
          <TerminalIcon className="size-4" />
          render_html({"{"} code: &quot;...&quot; {"}"})
        </div>
      );
    }, []),
  });

  if (!artifact) return null;

  return (
    <div
      className={
        "flex p-3 justify-stretch transition-[width] flex-grow basis-full"
      }
    >
      <div className="border rounded-lg w-full h-full">
        <Tabs defaultValue="source">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="source">Source Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent
            value="source"
            className="py-2 px-4 whitespace-pre-line break-words font-mono"
          >
            {artifact}
          </TabsContent>
          <TabsContent value="preview" className="px-4 py-2">
            {artifact && <iframe srcDoc={artifact} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
