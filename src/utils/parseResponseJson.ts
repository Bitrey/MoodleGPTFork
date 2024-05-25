import GPTAnswer, { ParsedGPTAnswer } from "../types/gptAnswer";
import QuestionType from "../types/questionType";
import Logs from "./logs";

/**
 * Parse ChatGPT raw response
 * @param response - The raw response
 * @returns The parsed response
 */
function parseResponseJson(response: string, type: QuestionType): GPTAnswer {
  // first, try a normal JSON parse
  let parsed: ParsedGPTAnswer | null = null;

  response = response.trim();

  try {
    parsed = JSON.parse(response);

    if (
      type === QuestionType.MULTIPLE_CHOICE &&
      !Number.isInteger(parsed.answer)
    ) {
      throw new Error("Answer is not an integer");
    }
  } catch (e) {
    Logs.warn("Failed to parse JSON response 1:", e);
  }

  // if that fails, maybe it's <text>```json\n{...}```<text>
  if (!parsed) {
    const match = response.match(/```json\n(.*)```/s);
    if (match) {
      try {
        parsed = JSON.parse(match[1]);

        if (
          type === QuestionType.MULTIPLE_CHOICE &&
          !Number.isInteger(parsed.answer)
        ) {
          throw new Error("Answer is not an integer");
        }
      } catch (e) {
        Logs.warn("Failed to parse JSON response 2:", e);
      }
    }
  }

  // if that fails, maybe it's <text><pre>{...}</pre><text>
  if (!parsed) {
    const match = response.match(/<pre>(.*)<\/pre>/s);
    if (match) {
      try {
        parsed = JSON.parse(match[1]);

        if (
          type === QuestionType.MULTIPLE_CHOICE &&
          !Number.isInteger(parsed.answer)
        ) {
          throw new Error("Answer is not an integer");
        }
      } catch (e) {
        Logs.warn("Failed to parse JSON response 3:", e);
      }
    }
  }

  // if that fails, maybe it's <text>{...}</text>
  if (!parsed) {
    const match = response.match(/>(.*)</s);
    if (match) {
      try {
        parsed = JSON.parse(match[1]);

        if (
          type === QuestionType.MULTIPLE_CHOICE &&
          !Number.isInteger(parsed.answer)
        ) {
          throw new Error("Answer is not an integer");
        }
      } catch (e) {
        Logs.warn("Failed to parse JSON response 4:", e);
      }
    }
  }

  // if that fails, maybe it's <text>{...}</text>
  if (!parsed) {
    const match = response.match(/{.*}/s);
    for (const m of match) {
      try {
        parsed = JSON.parse(m);

        if (
          type === QuestionType.MULTIPLE_CHOICE &&
          Number.isInteger(parsed.answer)
        ) {
          break;
        }
      } catch (e) {
        Logs.warn("Failed to parse JSON response 5:", e);
      }
    }
  }

  // if that fails, find "answer" and parse from { to }
  if (!parsed) {
    const match = response.match(/"answer":\s*(\d+)/);
    if (match) {
      const num = match[0].split(":")[1].trim();
      const answer = parseInt(num, 10);
      parsed = { answer };
    }
  }

  // if that fails, find "answer": "<string>" (instead of "answer": <number>)
  if (!parsed) {
    const match = response.match(/"answer":\s*"(.*?)"/);
    if (match) {
      const answer = match[1];
      parsed = { answer };
    }
  }

  if (!parsed) {
    Logs.error("Failed to parse JSON: " + response);
  } else {
    Logs.info("Successfully parsed response:", response);
  }

  return {
    rawResponse: response,
    parsed,
    error: parsed ? null : "Failed to parse JSON response [final]",
  };
}

export default parseResponseJson;
