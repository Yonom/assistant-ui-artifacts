import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, tool } from "ai";
import type { ModelMessage } from "ai";
import { z } from "zod";

export const runtime = "edge";

const supportedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Process model messages: filter unsupported files and fix data URL format
function processModelMessages(messages: ModelMessage[]): ModelMessage[] {
  return messages.map((message) => {
    if (message.role !== "user" || typeof message.content === "string") {
      return message;
    }

    const processedContent = message.content
      .filter((part) => {
        // Only allow supported image types
        if (part.type === "file" && "mediaType" in part) {
          const mediaType = part.mediaType as string;
          return supportedImageTypes.includes(mediaType);
        }
        return true;
      })
      .map((part) => {
        // Strip data URL prefix from data field if present
        if (
          part.type === "file" &&
          "data" in part &&
          typeof part.data === "string"
        ) {
          const dataUrlMatch = part.data.match(/^data:([^;]+);base64,(.+)$/);
          if (dataUrlMatch) {
            return {
              ...part,
              data: dataUrlMatch[2],
            };
          }
        }
        return part;
      });

    return { ...message, content: processedContent };
  });
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelMessages = processModelMessages(
    await convertToModelMessages(messages)
  );

  const result = streamText({
    model: openai("gpt-4o"),
    messages: modelMessages,
    tools: {
      render_html: tool({
        description:
          "Whenever the user asks for HTML code, call this function. The user will see the HTML code rendered in their browser.",
        inputSchema: z.object({
          code: z.string(),
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
