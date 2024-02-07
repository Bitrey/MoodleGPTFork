import GPTAnswer, { ParsedGPTAnswer } from "../types/gptAnswer";
import Logs from "./logs";

/**
 * Parse ChatGPT raw response
 * @param response - The raw response
 * @returns The parsed response
 */
function parseResponseJson(response: string): GPTAnswer {
  // first, try a normal JSON parse
  let parsed: ParsedGPTAnswer | null = null;

  response = response.trim();

  try {
    parsed = JSON.parse(response);

    if (!Number.isInteger(parsed.guess)) {
      throw new Error("Guess is not an integer");
    }
  } catch (e) {
    Logs.warn("Failed to parse JSON response:", e);
  }

  // if that fails, maybe it's <text>```json\n{...}```<text>
  if (!parsed) {
    const match = response.match(/```json\n(.*)```/s);
    if (match) {
      try {
        parsed = JSON.parse(match[1]);

        if (!Number.isInteger(parsed.guess)) {
          throw new Error("Guess is not an integer");
        }
      } catch (e) {
        Logs.warn("Failed to parse JSON response:", e);
      }
    }
  }

  // if that fails, maybe it's <text><pre>{...}</pre><text>
  if (!parsed) {
    const match = response.match(/<pre>(.*)<\/pre>/s);
    if (match) {
      try {
        parsed = JSON.parse(match[1]);

        if (!Number.isInteger(parsed.guess)) {
          throw new Error("Guess is not an integer");
        }
      } catch (e) {
        Logs.warn("Failed to parse JSON response:", e);
      }
    }
  }

  // if that fails, maybe it's <text>{...}</text>
  if (!parsed) {
    const match = response.match(/>(.*)</s);
    if (match) {
      try {
        parsed = JSON.parse(match[1]);

        if (!Number.isInteger(parsed.guess)) {
          throw new Error("Guess is not an integer");
        }
      } catch (e) {
        Logs.warn("Failed to parse JSON response:", e);
      }
    }
  }

  // if that fails, maybe it's <text>{...}</text>
  if (!parsed) {
    const match = response.match(/{.*}/s);
    for (const m of match) {
      try {
        parsed = JSON.parse(m);

        if (Number.isInteger(parsed.guess)) {
          break;
        }
      } catch (e) {
        Logs.warn("Failed to parse JSON response:", e);
      }
    }
  }

  // if that fails, find "guess" and parse from { to }
  if (!parsed) {
    const match = response.match(/"guess":\s*(\d+)/);
    if (match) {
      const num = match[0].split(":")[1].trim();
      const guess = parseInt(num, 10);
      parsed = { guess };
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
    error: parsed ? null : "Failed to parse JSON response",
  };
}

export default parseResponseJson;
