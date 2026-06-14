import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

// 1. Generate a post from a topic / idea
export const generatePost = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z
      .object({
        prompt: z.string().min(1).max(2000),
        platform: z.enum(["twitter", "linkedin", "both"]).default("both"),
        tone: z.string().max(60).default("friendly, confident"),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const limits =
      data.platform === "twitter"
        ? "Strict 270 characters max."
        : data.platform === "linkedin"
          ? "Up to 600 characters. Allow 2–3 short paragraphs."
          : "Keep under 270 characters so it works on both X and LinkedIn.";
    const { text } = await generateText({
      model: gateway(),
      prompt: `You write engaging social posts. Tone: ${data.tone}. ${limits} Avoid hashtags unless asked. No quotes around the post. Topic / idea:\n\n${data.prompt}`,
    });
    return { text: text.trim() };
  });

// 2. Improve an existing draft
export const improvePost = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z
      .object({
        text: z.string().min(1).max(4000),
        instruction: z.string().max(300).optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const extra = data.instruction ? `\nExtra instruction: ${data.instruction}` : "";
    const { text } = await generateText({
      model: gateway(),
      prompt: `Rewrite this social media post to be clearer, more engaging, and punchier while keeping its meaning. Keep it under 270 characters. Return only the rewritten post, no quotes, no commentary.${extra}\n\nPost:\n${data.text}`,
    });
    return { text: text.trim() };
  });

// 3. Suggest hashtags
export const suggestHashtags = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ text: z.string().min(1).max(4000) }).parse(i))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: gateway(),
      output: Output.object({
        schema: z.object({ hashtags: z.array(z.string()).max(6) }),
      }),
      prompt: `Suggest 4–6 short, relevant hashtags (no spaces, include the # symbol) for this post. Return JSON.\n\n${data.text}`,
    });
    return output;
  });

// 4. AI summary of recent activity
export const summarizeActivity = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z
      .object({
        notifications: z.array(
          z.object({
            platform: z.string(),
            type: z.string(),
            user: z.string(),
            text: z.string(),
            time: z.string(),
          }),
        ),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const list = data.notifications
      .map((n, i) => `${i + 1}. [${n.platform}] ${n.user} (${n.type}, ${n.time}): ${n.text}`)
      .join("\n");
    const { text } = await generateText({
      model: gateway(),
      prompt: `You are an executive assistant. Write a 2–3 sentence summary of the user's recent social activity. Highlight what needs a reply, who is most important to respond to, and the overall trend. Be concise and specific. No bullet points.\n\nActivity:\n${list}`,
    });
    return { summary: text.trim() };
  });

// 5. Best time to post (lightweight AI guess)
export const bestTimeToPost = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z.object({ platform: z.enum(["twitter", "linkedin"]), timezone: z.string().default("UTC") }).parse(i),
  )
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: gateway(),
      output: Output.object({
        schema: z.object({
          suggestion: z.string(),
          times: z.array(z.string()).max(3),
        }),
      }),
      prompt: `Give the 2–3 best times of day to post on ${data.platform} for a general professional audience in timezone ${data.timezone}. Return short HH:MM 24h strings and a one-sentence rationale.`,
    });
    return output;
  });
