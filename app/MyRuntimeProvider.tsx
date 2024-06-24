"use client";

import { createOpenAI, openai } from "@ai-sdk/openai";
import {
  AssistantRuntimeProvider,
  ThreadMessage,
  useLocalRuntime,
} from "@assistant-ui/react";
import { unstable_VercelModelAdapter as VercelModelAdapter } from "@assistant-ui/react-ai-sdk";
import { streamText } from "ai";

const model = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_FIREWORKS_API_KEY,
  baseURL: "https://api.fireworks.ai/inference/v1",
})("accounts/fireworks/models/firefunction-v2");

export const generateCode = async (
  messages: readonly ThreadMessage[],
  callback: (code: string) => void
) => {
  console.log("generating");

  const result = await streamText({
    model,
    system:
      "Task: Generate HTML code, directly output HTML code and ONLY HTML.\n\nChat history:\n" +
      JSON.stringify(messages),
    messages: [],
  });

  let text = "";
  for await (const delta of result.textStream) {
    text += delta;
    callback(text);
  }
  return text;
};

const chatAdapter = new VercelModelAdapter(model);

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const runtime = useLocalRuntime(chatAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
