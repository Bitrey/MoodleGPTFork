import Config, { subject } from "../types/config";
import GPTAnswer from "../types/gptAnswer";
import parseResponseJson from "../utils/parseResponseJson";
import { getSafeSystemPrompt, getSystemPrompt } from "../utils/prompt";

/**
 * Get the response from chatGPT api
 * @param config
 * @param question
 * @param smart
 * @returns
 */
async function getChatGPTResponse(
  config: Config,
  userPrompt: string,
  smart: boolean,
): Promise<GPTAnswer> {
  const controller = new AbortController();
  // DEBUG: timeout now at 150s
  const timeoutControler = setTimeout(() => controller.abort(), 150000);
  const req = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    signal: config.timeout ? controller.signal : null,
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: smart ? getSafeSystemPrompt(subject) : getSystemPrompt(),
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      top_p: 1.0,
      presence_penalty: 1.0,
      stop: null,
    }),
  });
  clearTimeout(timeoutControler);
  const rep = await req.json();
  const response = rep.choices[0].message.content;
  return parseResponseJson(response);
}

export default getChatGPTResponse;
