import Config from "../../types/config";
import GPTAnswer from "../../types/gptAnswer";

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

  if (
    inputList.length !== 1 ||
    (input.tagName !== "TEXTAREA" && input.type !== "text")
  )
    return false;

  if (config.typing) {
    let index = 0;
    input.addEventListener("keydown", function (event: KeyboardEvent) {
      if (event.key === "Backspace") index = gptAnswer.response.length + 1;
      if (index > gptAnswer.response.length) return;
      event.preventDefault();
      input.value = gptAnswer.response.slice(0, ++index);
    });
  } else {
    input.value = gptAnswer.response;
  }

  return true;
}

export default handleTextbox;
