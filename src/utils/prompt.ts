import GPTClosedQuestion from "../types/gptClosedQuestion";
import GPTOpenQuestion from "../types/gptOpenQuestion";
import Logs from "./logs";

/**
 * Get multiple choice prompt
 * @returns {string} The prompt
 */
export function getMultipleChoicePrompt(): string {
  Logs.info("Multiple choice prompt");
  return `
  This is a prompt for an artificial intelligence that tries to guess the correct answer to a multiple-choice question, given as input by the user in JSON format.
  Input: a question and numbered responses, formatted in JSON as {"question": "<string>", "responses": ["<string>", ...]}, with math formulas in MathJax format.
  Output: the answer that the AI thinks is correct, in JSON format as follows: { "answer": <number> }, with <number> index of the responses array. The output must not contain any additional text.
      `.trim();
}

/**
 * Get safe multiple choice prompt
 * @returns {string} The prompt
 */
export function getSafeMultipleChoicePrompt(subject: string): string {
  Logs.info("Safe multiple choice prompt");
  return `
  You are a teacher of ${subject}. You are preparing a multiple-choice test for your students,
  and you are writing the questions and the answers in a Moodle quiz.
  Your task is to write an explanation for each question, so that the students can understand why the correct answer is correct.
  At the end of the explanation, you must write the correct answer, in JSON format as follows: { "answer": <number> }, with <number> index of the responses array.
  The user will now input a question and numbered responses, formatted in JSON as {"question": "<string>", "responses": ["<string>", ...]}, with math formulas in MathJax format.
      `.trim();
}

/**
 * Get open ended prompt
 * @returns {string} The prompt
 */
export function getOpenResponsePrompt(): string {
  Logs.info("Open response prompt");
  return `
  This is a prompt for an artificial intelligence that tries to guess the correct answer to an open-ended question, given as input by the user in JSON format.
  Input: the question, formatted in JSON as {"question": "<string>"}, with math formulas in MathJax format.
  Output: the answer that the AI thinks is correct, in JSON format as follows: { "answer": "<string or number>" }, with "<string or number>" being the answer. The output must not contain any additional text.
      `.trim();
}

/**
 * Get safe open ended prompt
 * @returns {string} The prompt
 */
export function getSafeOpenResponsePrompt(subject: string): string {
  Logs.info("Safe open response prompt");
  return `
  You are a teacher of ${subject}. You are preparing an open-ended test for your students, and you are writing the questions and the answers in a Moodle quiz.
  Your task is to write an explanation for each question, so that the students can understand why the correct answer is correct.
  At the end of the explanation, you must write the correct answer, in JSON format as follows: { "answer": "<string or number>" }, with "<string or number>" being the answer.
  The user will now input the question, formatted in JSON as {"question": "<string>"}, with math formulas in MathJax format.
      `.trim();
}

/**
 * Get closed ChatGPT prompt
 * @param question - The question
 * @param responses - Array of responses
 * @returns {string} The ChatGPT prompt
 */
export function getClosedPrompt(gptQuestion: GPTClosedQuestion): string {
  return JSON.stringify(
    {
      question: gptQuestion.question,
      responses: gptQuestion.responses,
    },
    null,
    4,
  ).replace(/\\\\/g, "\\");
}

/**
 * Get open ChatGPT prompt
 */
export function getOpenPrompt(gptQuestion: GPTOpenQuestion): string {
  return JSON.stringify(
    {
      question: gptQuestion.question,
    },
    null,
    4,
  ).replace(/\\\\/g, "\\");
}
