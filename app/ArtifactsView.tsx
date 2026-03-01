"use client";
import {
  ToolCallMessagePart,
  useThread,
} from "@assistant-ui/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ArtifactsView = () => {
  const artifact = useThread((t) => {
    return t.messages
      .flatMap((m) =>
        m.content.filter(
          (c): c is ToolCallMessagePart =>
            c.type === "tool-call" && c.toolName === "render_html"
        )
      )
      .at(-1)?.args["code"] as string | undefined;
  });

  if (!artifact) return null;

  return (
    <div
      className={
        "flex p-3 justify-stretch transition-[width] flex-grow basis-full"
      }
    >
      <div className="border rounded-lg w-full h-full overflow-hidden">
        <Tabs defaultValue="source" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="source">Source Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent
            value="source"
            className="py-2 px-4 whitespace-pre-line break-words font-mono h-full overflow-y-scroll"
          >
            {artifact}
          </TabsContent>
          <TabsContent value="preview" className="px-4 py-2 h-full flex-grow">
            {artifact && <iframe className="w-full h-full" srcDoc={artifact} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
