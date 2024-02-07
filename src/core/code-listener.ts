import Config from "../types/config";
import ReplyFn from "../types/replyFn";
import Logs from "../utils/logs";
import titleIndications from "../utils/title-indications";

const pressedKeys: string[] = [];
const listeners: {
  element: HTMLElement;
  fn: (this: HTMLElement, ev: MouseEvent) => any;
}[] = [];

/**
 * Create a listener on the keyboard to inject the code
 * @param config
 */
function codeListener(config: Config, replyFn: ReplyFn) {
  document.body.addEventListener("keydown", function (event) {
    pressedKeys.push(event.key);
    if (pressedKeys.length > config.code.length) pressedKeys.shift();

    const fast = pressedKeys.join("") === config.code;
    const smart = pressedKeys.join("") === config.codeSmart;

    if (fast || smart) {
      pressedKeys.length = 0;
      setUpMoodleGpt(config, replyFn, smart);
    }

    if (config.logs) {
      Logs.info("Pressed keys:", pressedKeys);
      Logs.info("Fast:", fast);
      Logs.info("Smart:", smart);
    }
  });
}

/**
 * Setup moodleGPT into the page (remove/injection)
 * @param config
 * @param replyFn
 * @param smart
 * @returns
 */
function setUpMoodleGpt(config: Config, replyFn: ReplyFn, smart: boolean) {
  /* Removing events */
  if (listeners.length > 0) {
    for (const listener of listeners) {
      if (config.cursor) listener.element.style.cursor = "initial";
      listener.element.removeEventListener("click", listener.fn);
    }
    if (config.title) titleIndications("Removed");
    listeners.length = 0;
    return;
  }

  /* Code injection */
  const inputQuery = ["checkbox", "radio", "text", "number"]
    .map((e) => `input[type="${e}"]`)
    .join(",");
  const query = inputQuery + ", textarea, select, [contenteditable]";
  const forms = document.querySelectorAll(".formulation");

  if (config.logs) {
    Logs.info("MoodleGPT is running");
    // Logs.info("Query:", query);
    Logs.info("Forms:", forms);
  }

  for (const form of forms) {
    const questionElem: HTMLElement = form.querySelector(".qtext");

    if (config.cursor) questionElem.style.cursor = "pointer";

    const injectionFunction = replyFn.bind(
      null,
      config,
      questionElem,
      form as HTMLElement,
      query,
      smart,
    );
    Logs.info("Injection function:", injectionFunction);
    Logs.info("Smart:", smart);
    listeners.push({ element: questionElem, fn: injectionFunction });
    questionElem.addEventListener("click", injectionFunction);

    if (config.logs) {
      Logs.info("Listener added on:", questionElem);
    }
  }

  if (config.title) titleIndications("Injected");

  if (config.logs) {
    Logs.info("Listeners:", listeners);
    Logs.info("Pressed keys:", pressedKeys);
  }
}

/**
 * Remove the event listener on a specific question
 * @param element
 */
function removeListener(element: HTMLElement) {
  const index = listeners.findIndex((listener) => listener.element === element);
  if (index !== -1) {
    const listener = listeners.splice(index, 1)[0];
    listener.element.removeEventListener("click", listener.fn);
  }
}

export { codeListener, removeListener };
