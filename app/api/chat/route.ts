import { openai } from "@ai-sdk/openai";
import { createEdgeRuntimeAPI } from "@assistant-ui/react/edge";

export const runtime = "edge";

export const { POST } = createEdgeRuntimeAPI({
  model: openai("gpt-3.5-turbo"),
});
