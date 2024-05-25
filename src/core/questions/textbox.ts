import Config from "../../types/config";
import GPTAnswer from "../../types/gptAnswer";
import Logs from "../../utils/logs";

/**
 * Handle textbox
 * @param config
 * @param answersElem
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleTextbox(
  config: Config,
  answersElem: HTMLElement,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer,
): boolean {
  const input = inputList[0] as HTMLInputElement | HTMLTextAreaElement;

  const answer = gptAnswer.parsed.answer.toString();

  if (
    inputList.length !== 1 ||
    (input.tagName !== "TEXTAREA" && input.type !== "text")
  ) {
    Logs.info(
      "[Textbox Handler] Not a textbox",
      inputList,
      input.tagName,
      input.type,
    );
    return false;
  }

  Logs.info("[Textbox Handler] Handler textbox", gptAnswer, answer);

  if (config.typing) {
    let index = 0;
    input.addEventListener("keydown", function (event: KeyboardEvent) {
      if (event.key === "Backspace") index = answer.length + 1;
      if (index > answer.length) return;
      event.preventDefault();
      input.value = answer.slice(0, ++index);
    });
  } else {
    input.value = answer;
  }

  return true;
}

export default handleTextbox;
