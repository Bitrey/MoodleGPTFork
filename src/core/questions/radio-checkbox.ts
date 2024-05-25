import Config from "../../types/config";
import GPTAnswer from "../../types/gptAnswer";
import Logs from "../../utils/logs";
import normalizeText from "../../utils/normalize-text";

/**
 * Handle checkbox and input elements
 * @param config
 * @param answersElem
 * @param inputList
 * @param gptAnswer
 */
function handleRadioAndCheckbox(
  config: Config,
  answersElem: HTMLElement,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer,
): boolean {
  let { answer } = gptAnswer.parsed;

  const input = inputList[0] as HTMLInputElement | HTMLTextAreaElement;

  // check if radio or checkbox
  if (input.type !== "radio" && input.type !== "checkbox") return false;

  if (typeof answer === "string" && !isNaN(Number(answer))) {
    answer = Number(answer);
  }
  if (typeof answer !== "number") return false;

  Logs.info("[Radio Handler] Handler radio and checkbox", gptAnswer, answer);

  // select radio inputs, check if value === gptAnswer.answer
  answersElem
    .querySelectorAll("input[type=radio]")
    .forEach((input: HTMLInputElement) => {
      if (input.value.toString() === answer.toString()) {
        input.checked = true;
      }
    });

  return true;
}

export default handleRadioAndCheckbox;
