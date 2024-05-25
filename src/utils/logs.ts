import GPTAnswer from "../types/gptAnswer";
import GPTClosedQuestion, {
  isClosedQuestion,
} from "../types/gptClosedQuestion";
import GPTOpenQuestion from "../types/gptOpenQuestion";
class Logs {
  static question(question: GPTClosedQuestion | GPTOpenQuestion) {
    const cssQ = "color: cyan";
    const cssR = "color: blue";
    console.log(
      "%c[QUESTION]: %s\n%c[RESPONSES]: %s",
      cssQ,
      JSON.stringify(question.question),
      cssR,
      isClosedQuestion(question)
        ? question.responses
            .map((r, i) => `${i}: ${JSON.stringify(r)}`)
            .join("\n")
        : "Open question",
    );
  }

  static responseTry(text: string, valide: boolean) {
    const css = "color: " + (valide ? "green" : "red");
    console.log("%c[CHECKING]: %s", css, text);
  }

  static array(arr: unknown[]) {
    console.log("[CORRECTS] ", arr);
  }

  static response(gptAnswer: GPTAnswer) {
    if (gptAnswer.error) {
      Logs.error(gptAnswer.error);
      return;
    }
    console.log("Original:", gptAnswer.rawResponse);
    console.log("Parsed:", gptAnswer.parsed);
  }

  static info(text: string, ...args: unknown[]) {
    const css = "color: blue";
    console.log("%c[INFO]: %s", css, text, ...args);
  }

  static warn(text: string, ...args: unknown[]) {
    const css = "color: orange";
    console.warn("%c[WARN]: %s", css, text, ...args);
  }

  static error(text: string, ...args: unknown[]) {
    const css = "color: red";
    console.error("%c[ERROR]: %s", css, text, ...args);
  }
}

export default Logs;
