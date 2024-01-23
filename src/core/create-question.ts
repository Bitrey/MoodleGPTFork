import Config from "../types/config";
import normalizeText from "../utils/normalize-text";
import htmlTableToString from "../utils/html-table-to-string";
import Logs from "../utils/logs";
import clearMathJax from "../utils/clearMathJax";
import GPTQuestion from "../types/gptQuestion";

/**
 * Normalize the question and add sub informations
 * @param langage
 * @param question
 * @param answers
 * @returns
 */
function createQuestion(
  config: Config,
  _questionContainer: HTMLElement,
  formContainer: HTMLElement,
): GPTQuestion {
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

export default createQuestion;
