import GPTQuestion from "../types/gptQuestion";
import Logs from "./logs";

/**
 * Get system prompt
 * @returns {string} The system prompt
 */
export function getSystemPrompt(): string {
  return `
  This is a prompt for an artificial intelligence that tries to guess the correct answer to a multiple-choice question, given as input by the user in JSON format.
  Input: a question and numbered responses, formatted in JSON as {"question": "<string>", "responses": ["<string>", ...]}, with math formulas in MathJax format.
  Output: the answer that the AI thinks is correct, in JSON format as follows: { "guess": <number> }, with <number> index of the responses array. The output must not contain any additional text.
      `.trim();
}

/**
 * Get safe system prompt
 * @returns {string} The system prompt
 */
export function getSafeSystemPrompt(subject: string): string {
  return `
  You are a teacher of ${subject}. You are preparing a multiple-choice test for your students,
  and you are writing the questions and the answers in a Moodle quiz.
  Your task is to write an explanation for each question, so that the students can understand why the correct answer is correct.
  At the end of the explanation, you must write the correct answer, in JSON format as follows: { "guess": <number> }, with <number> index of the responses array.
  The user will now input a question and numbered responses, formatted in JSON as {"question": "<string>", "responses": ["<string>", ...]}, with math formulas in MathJax format.
      `.trim();
}

/**
 * Get ChatGPT prompt
 * @param question - The question
 * @param responses - Array of responses
 * @returns {string} The ChatGPT prompt
 */
function getPrompt(gptQuestion: GPTQuestion): string {
  return JSON.stringify(
    {
      question: gptQuestion.question,
      responses: gptQuestion.responses,
    },
    null,
    4,
  ).replace(/\\\\/g, "\\");
}

export default getPrompt;
