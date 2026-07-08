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

const FormatEnum = z.enum(["post", "story", "caption", "comment", "reply", "bio", "thread", "dm"]);
export type WritingFormat = z.infer<typeof FormatEnum>;

function guidance(format: WritingFormat, platform: string) {
  const base: Record<WritingFormat, string> = {
    post: "A standalone social post. 1–3 short paragraphs, natural rhythm.",
    story: "A short first-person story / anecdote suitable for social. Vivid, human, under 120 words.",
    caption: "A punchy caption for a photo or video. 1–2 lines. Optional single emoji.",
    comment: "A thoughtful comment on someone else's post. Warm, specific, adds value. 1–2 sentences.",
    reply: "A concise reply to a message or comment. Friendly, direct. 1–2 sentences.",
    bio: "A profile bio. Under 160 characters. Mention role + interest + a hook.",
    thread: "A short thread of 3–5 numbered posts. Each ≤ 260 characters. Separate with a blank line.",
    dm: "A polite direct message. Friendly opener, clear ask, short sign-off. Under 90 words.",
  };
  const platformNote =
    platform === "twitter" || platform === "x"
      ? "Target X (Twitter). Keep each post ≤ 270 characters."
      : platform === "linkedin"
        ? "Target LinkedIn. Professional but human. Up to 600 characters."
        : platform === "instagram"
          ? "Target Instagram. Casual, expressive. Line breaks welcome."
          : platform === "tiktok"
            ? "Target TikTok caption. Very casual, hook-first."
            : platform === "facebook"
              ? "Target Facebook. Friendly, personal."
              : platform === "reddit"
                ? "Target Reddit. Conversational, no marketing tone."
                : platform === "whatsapp" || platform === "telegram" || platform === "dm"
                  ? "Target a chat message. Personal and casual."
                  : "Keep it universal so it works on any platform.";
  return `${base[format]} ${platformNote}`;
}

export const writeContent = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z
      .object({
        prompt: z.string().min(1).max(2000),
        format: FormatEnum.default("post"),
        platform: z.string().max(30).default("any"),
        tone: z.string().max(60).default("friendly, confident"),
        emojis: z.boolean().default(false),
        hashtags: z.boolean().default(false),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const rules = guidance(data.format, data.platform);
    const extras = [
      data.emojis ? "You may use 1–3 tasteful emojis." : "No emojis.",
      data.hashtags ? "End with 2–4 relevant hashtags." : "No hashtags.",
    ].join(" ");
    const { text } = await generateText({
      model: gateway(),
      prompt: `You are a sharp social copywriter. Tone: ${data.tone}. ${rules} ${extras} Return only the finished text, no quotes, no commentary.\n\nBrief / idea:\n${data.prompt}`,
    });
    return { text: text.trim() };
  });

export const improveContent = createServerFn({ method: "POST" })
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
      prompt: `Rewrite this to be clearer, more engaging, and punchier while keeping its meaning and length range. Return only the rewritten text.${extra}\n\nText:\n${data.text}`,
    });
    return { text: text.trim() };
  });

export const suggestHashtags = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ text: z.string().min(1).max(4000) }).parse(i))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: gateway(),
      output: Output.object({
        schema: z.object({ hashtags: z.array(z.string()).max(6) }),
      }),
      prompt: `Suggest 4–6 short relevant hashtags (include the # symbol) for this text. Return JSON.\n\n${data.text}`,
    });
    return output;
  });
