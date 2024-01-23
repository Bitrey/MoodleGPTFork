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
  // const input: HTMLInputElement = inputList?.[0];

  // if (!input || (input.type !== "checkbox" && input.type !== "radio"))
  //   return false;

  // for (const input of inputList as NodeListOf<HTMLInputElement>) {
  //   if (config.logs) {
  //     Logs.info(
  //       `Trying to check input with value ${input.value} and name ${input.name}`,
  //     );
  //   }

  //   const content = normalizeText(input.parentNode.textContent);
  //   const valide = gptAnswer.normalizedResponse.includes(content);
  //   if (config.logs) Logs.responseTry(content, valide);
  //   if (valide) {
  //     if (config.mouseover) {
  //       input.addEventListener("mouseover", () => (input.checked = true), {
  //         once: true,
  //       });
  //     } else {
  //       input.checked = true;
  //     }
  //   }
  // }
  if (typeof gptAnswer.parsed.guess !== "number") return false;

  // select radio inputs, check if value === gptAnswer.guess
  answersElem
    .querySelectorAll("input[type=radio]")
    .forEach((input: HTMLInputElement) => {
      if (input.value.toString() === gptAnswer.parsed.guess.toString()) {
        input.checked = true;
      }
    });

  return true;
}

export default handleRadioAndCheckbox;
