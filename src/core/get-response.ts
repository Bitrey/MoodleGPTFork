import Config, { subject } from "../types/config";
import GPTAnswer from "../types/gptAnswer";
import QuestionType from "../types/questionType";
import Logs from "../utils/logs";
import parseResponseJson from "../utils/parseResponseJson";
import {
  getMultipleChoicePrompt,
  getOpenResponsePrompt,
  getSafeMultipleChoicePrompt,
  getSafeOpenResponsePrompt,
} from "../utils/prompt";

/**
 * Get the response from chatGPT api
 * @param config
 * @param question
 * @param smart
 * @returns
 */
async function getChatGPTResponse(
  config: Config,
  type: QuestionType,
  userPrompt: string,
  smart: boolean,
): Promise<GPTAnswer> {
  Logs.info("Getting response with type", type);

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
          content:
            type === QuestionType.MULTIPLE_CHOICE
              ? smart
                ? getSafeMultipleChoicePrompt(subject)
                : getMultipleChoicePrompt()
              : smart
              ? getSafeOpenResponsePrompt(subject)
              : getOpenResponsePrompt(),
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
  return parseResponseJson(response, type);
}

export default getChatGPTResponse;
