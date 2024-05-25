import Config from "../types/config";
import normalizeText from "../utils/normalize-text";
import htmlTableToString from "../utils/html-table-to-string";
import Logs from "../utils/logs";
import clearMathJax from "../utils/clearMathJax";
import GPTClosedQuestion from "../types/gptClosedQuestion";
import GPTOpenQuestion from "../types/gptOpenQuestion";

/**
 * Normalize the question and add sub informations
 * @returns
 */
export function createClosedQuestion(
  config: Config,
  _questionContainer: HTMLElement,
  formContainer: HTMLElement,
): GPTClosedQuestion {
  if (config.logs) {
    Logs.info("Question container:", _questionContainer);
    Logs.info("Answers container:", formContainer);
  }

  const questionContainer = clearMathJax(_questionContainer);

  // extract .answernumber <span>s, get div after
  const _answerElements: NodeListOf<HTMLElement> =
    formContainer.querySelectorAll(".answernumber + div");
  const answerElements: HTMLElement[] = [];
  for (const answerElement of _answerElements) {
    answerElements.push(clearMathJax(answerElement));
  }

  let question = questionContainer.innerText;

  if (config.logs) Logs.info("Question:", question);

  /* We remove unnecessary information */
  const accesshideElements: NodeListOf<HTMLElement> =
    formContainer.querySelectorAll(".accesshide");
  for (const useless of accesshideElements) {
    question = question.replace(useless.innerText, "");
  }

  /* Make tables more readable for chat-gpt */
  const tables: NodeListOf<HTMLTableElement> =
    formContainer.querySelectorAll(".qtext table");
  for (const table of tables) {
    question = question.replace(
      table.innerText,
      "\n" + htmlTableToString(table) + "\n",
    );
  }

  return {
    question: normalizeText(question),
    responses: Array.from(answerElements).map((e) =>
      normalizeText(e.innerText),
    ),
  };
}

/**
 * Normalize the question and add sub informations
 * @returns
 */
export function createOpenQuestion(
  config: Config,
  _questionContainer: HTMLElement,
): GPTOpenQuestion {
  if (config.logs) {
    Logs.info("Question container:", _questionContainer);
  }

  const questionContainer = clearMathJax(_questionContainer);

  let question = questionContainer.innerText;

  if (config.logs) Logs.info("Question:", question);

  /* We remove unnecessary information */
  const accesshideElements: NodeListOf<HTMLElement> =
    questionContainer.querySelectorAll(".accesshide");
  for (const useless of accesshideElements) {
    question = question.replace(useless.innerText, "");
  }

  return {
    question: normalizeText(question),
  };
}
