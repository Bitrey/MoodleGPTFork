import Config from "../types/config";
import ReplyFn from "../types/replyFn";
import Logs from "../utils/logs";
import getChatGPTResponse from "./get-response";
import createQuestion from "./create-question";
import handleRadioAndCheckbox from "./questions/radio-checkbox";
// import handleSelect from "./questions/select";
// import handleTextbox from "./questions/textbox";
import handleClipboard from "./questions/clipboard";
// import handleNumber from "./questions/number";
// import handleContentEditable from "./questions/contenteditable";
import { removeListener } from "./code-listener";
import getPrompt from "../utils/prompt";
import GPTAnswer from "../types/gptAnswer";

/**
 * Reply to the question
 * @param config
 * @param questionElem
 * @param form
 * @param query
 * @returns
 */
const reply: ReplyFn = async function (
  config: Config,
  questionElem: HTMLElement,
  form: HTMLElement,
  query: string,
) {
  if (config.cursor) questionElem.style.cursor = "wait";

  const question = createQuestion(config, questionElem, form);
  const inputList: NodeListOf<HTMLElement> = form.querySelectorAll(query);
  const answer: HTMLElement = form.querySelector(".answer");

  if (config.logs) {
    Logs.question(question);
  }

  let gptAnswer: GPTAnswer;
  try {
    const prompt = getPrompt(question);
    if (config.logs) {
      Logs.info("Prompt:", prompt);
    }
    gptAnswer = await getChatGPTResponse(config, prompt);
  } catch (err) {
    Logs.error("Error while getting response from ChatGPT API:", err);
    return null;
  }

  const haveError = gptAnswer.parsed === undefined || gptAnswer.error !== null;

  if (config.cursor)
    questionElem.style.cursor =
      config.infinite || haveError ? "pointer" : "initial";

  if (haveError) {
    Logs.error("GPT answer error:", gptAnswer.error);
    return null;
  }

  if (config.logs) {
    Logs.response(gptAnswer);
  }

  /* Handle clipboard mode */
  // if (config.mode === "clipboard") {
  //   if (!config.infinite) removeListener(questionElem);
  //   handleClipboard(config, gptAnswer);
  //   return null;
  // }

  /* Handle question to answer mode */
  // if (config.mode === "question-to-answer") {
  //   removeListener(questionElem);

  //   const questionContainer = form.querySelector<HTMLElement>(".qtext");
  //   const questionBackup = questionContainer.textContent;

  //   questionContainer.textContent = gptAnswer.response;
  //   questionContainer.style.whiteSpace = "pre-wrap";

  //   questionContainer.addEventListener("click", function () {
  //     const isNotResponse = questionContainer.textContent === questionBackup;
  //     questionContainer.style.whiteSpace = isNotResponse ? "pre-wrap" : null;
  //     questionContainer.textContent = isNotResponse
  //       ? gptAnswer.response
  //       : questionBackup;
  //   });
  //   return null;
  // }

  /* Better then set once on the event because if there is an error the user can click an other time on the question */
  if (!config.infinite) removeListener(questionElem);

  const handlers = [
    // handleContentEditable,
    // handleTextbox,
    // handleNumber,
    // handleSelect,
    handleRadioAndCheckbox,
  ];

  for (const handler of handlers) {
    if (handler(config, answer, inputList, gptAnswer)) return null;
  }

  /* In the case we can't auto complete the question */
  handleClipboard(config, gptAnswer);
};

export default reply;
