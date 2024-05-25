(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  const isClosedQuestion = (question) => {
      return (typeof question === "object" &&
          typeof question.question === "string" &&
          Array.isArray(question.responses) &&
          question.responses.every((r) => typeof r === "string"));
  };

  class Logs {
      static question(question) {
          const cssQ = "color: cyan";
          const cssR = "color: blue";
          console.log("%c[QUESTION]: %s\n%c[RESPONSES]: %s", cssQ, JSON.stringify(question.question), cssR, isClosedQuestion(question)
              ? question.responses
                  .map((r, i) => `${i}: ${JSON.stringify(r)}`)
                  .join("\n")
              : "Open question");
      }
      static responseTry(text, valide) {
          const css = "color: " + (valide ? "green" : "red");
          console.log("%c[CHECKING]: %s", css, text);
      }
      static array(arr) {
          console.log("[CORRECTS] ", arr);
      }
      static response(gptAnswer) {
          if (gptAnswer.error) {
              Logs.error(gptAnswer.error);
              return;
          }
          console.log("Original:", gptAnswer.rawResponse);
          console.log("Parsed:", gptAnswer.parsed);
      }
      static info(text, ...args) {
          const css = "color: blue";
          console.log("%c[INFO]: %s", css, text, ...args);
      }
      static warn(text, ...args) {
          const css = "color: orange";
          console.warn("%c[WARN]: %s", css, text, ...args);
      }
      static error(text, ...args) {
          const css = "color: red";
          console.error("%c[ERROR]: %s", css, text, ...args);
      }
  }

  /**
   * Show some informations into the document title and remove it after 3000ms
   * @param text
   */
  function titleIndications(text) {
      const backTitle = document.title;
      document.title = text;
      setTimeout(() => (document.title = backTitle), 3000);
  }

  const pressedKeys = [];
  const listeners = [];
  /**
   * Create a listener on the keyboard to inject the code
   * @param config
   */
  function codeListener(config, replyFn) {
      document.body.addEventListener("keydown", function (event) {
          pressedKeys.push(event.key);
          if (pressedKeys.length > config.code.length)
              pressedKeys.shift();
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
  function setUpMoodleGpt(config, replyFn, smart) {
      /* Removing events */
      if (listeners.length > 0) {
          for (const listener of listeners) {
              if (config.cursor)
                  listener.element.style.cursor = "initial";
              listener.element.removeEventListener("click", listener.fn);
          }
          if (config.title)
              titleIndications("Removed");
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
          const questionElem = form.querySelector(".qtext");
          if (config.cursor)
              questionElem.style.cursor = "pointer";
          const injectionFunction = replyFn.bind(null, config, questionElem, form, query, smart);
          Logs.info("Injection function:", injectionFunction);
          Logs.info("Smart:", smart);
          Logs.info("Question element:", questionElem);
          Logs.info("Form element:", form);
          Logs.info("Query:", query);
          listeners.push({ element: questionElem, fn: injectionFunction });
          questionElem.addEventListener("click", injectionFunction);
          if (config.logs) {
              Logs.info("Listener added on:", questionElem);
          }
      }
      if (config.title)
          titleIndications("Injected");
      if (config.logs) {
          Logs.info("Listeners:", listeners);
          Logs.info("Pressed keys:", pressedKeys);
      }
  }
  /**
   * Remove the event listener on a specific question
   * @param element
   */
  function removeListener(element) {
      const index = listeners.findIndex((listener) => listener.element === element);
      if (index !== -1) {
          const listener = listeners.splice(index, 1)[0];
          listener.element.removeEventListener("click", listener.fn);
      }
  }

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise, SuppressedError, Symbol */


  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };

  const subject = "Numerical Analysis";

  var QuestionType;
  (function (QuestionType) {
      QuestionType["MULTIPLE_CHOICE"] = "MULTIPLE_CHOICE";
      QuestionType["OPEN_ENDED"] = "OPEN_ENDED";
  })(QuestionType || (QuestionType = {}));
  var QuestionType$1 = QuestionType;

  /**
   * Parse ChatGPT raw response
   * @param response - The raw response
   * @returns The parsed response
   */
  function parseResponseJson(response, type) {
      // first, try a normal JSON parse
      let parsed = null;
      response = response.trim();
      try {
          parsed = JSON.parse(response);
          if (type === QuestionType$1.MULTIPLE_CHOICE &&
              !Number.isInteger(parsed.answer)) {
              throw new Error("Answer is not an integer");
          }
      }
      catch (e) {
          Logs.warn("Failed to parse JSON response 1:", e);
      }
      // if that fails, maybe it's <text>```json\n{...}```<text>
      if (!parsed) {
          const match = response.match(/```json\n(.*)```/s);
          if (match) {
              try {
                  parsed = JSON.parse(match[1]);
                  if (type === QuestionType$1.MULTIPLE_CHOICE &&
                      !Number.isInteger(parsed.answer)) {
                      throw new Error("Answer is not an integer");
                  }
              }
              catch (e) {
                  Logs.warn("Failed to parse JSON response 2:", e);
              }
          }
      }
      // if that fails, maybe it's <text><pre>{...}</pre><text>
      if (!parsed) {
          const match = response.match(/<pre>(.*)<\/pre>/s);
          if (match) {
              try {
                  parsed = JSON.parse(match[1]);
                  if (type === QuestionType$1.MULTIPLE_CHOICE &&
                      !Number.isInteger(parsed.answer)) {
                      throw new Error("Answer is not an integer");
                  }
              }
              catch (e) {
                  Logs.warn("Failed to parse JSON response 3:", e);
              }
          }
      }
      // if that fails, maybe it's <text>{...}</text>
      if (!parsed) {
          const match = response.match(/>(.*)</s);
          if (match) {
              try {
                  parsed = JSON.parse(match[1]);
                  if (type === QuestionType$1.MULTIPLE_CHOICE &&
                      !Number.isInteger(parsed.answer)) {
                      throw new Error("Answer is not an integer");
                  }
              }
              catch (e) {
                  Logs.warn("Failed to parse JSON response 4:", e);
              }
          }
      }
      // if that fails, maybe it's <text>{...}</text>
      if (!parsed) {
          const match = response.match(/{.*}/s);
          for (const m of match) {
              try {
                  parsed = JSON.parse(m);
                  if (type === QuestionType$1.MULTIPLE_CHOICE &&
                      Number.isInteger(parsed.answer)) {
                      break;
                  }
              }
              catch (e) {
                  Logs.warn("Failed to parse JSON response 5:", e);
              }
          }
      }
      // if that fails, find "answer" and parse from { to }
      if (!parsed) {
          const match = response.match(/"answer":\s*(\d+)/);
          if (match) {
              const num = match[0].split(":")[1].trim();
              const answer = parseInt(num, 10);
              parsed = { answer };
          }
      }
      // if that fails, find "answer": "<string>" (instead of "answer": <number>)
      if (!parsed) {
          const match = response.match(/"answer":\s*"(.*?)"/);
          if (match) {
              const answer = match[1];
              parsed = { answer };
          }
      }
      if (!parsed) {
          Logs.error("Failed to parse JSON: " + response);
      }
      else {
          Logs.info("Successfully parsed response:", response);
      }
      return {
          rawResponse: response,
          parsed,
          error: parsed ? null : "Failed to parse JSON response [final]",
      };
  }

  /**
   * Get multiple choice prompt
   * @returns {string} The prompt
   */
  function getMultipleChoicePrompt() {
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
  function getSafeMultipleChoicePrompt(subject) {
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
  function getOpenResponsePrompt() {
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
  function getSafeOpenResponsePrompt(subject) {
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
  function getClosedPrompt(gptQuestion) {
      return JSON.stringify({
          question: gptQuestion.question,
          responses: gptQuestion.responses,
      }, null, 4).replace(/\\\\/g, "\\");
  }
  /**
   * Get open ChatGPT prompt
   */
  function getOpenPrompt(gptQuestion) {
      return JSON.stringify({
          question: gptQuestion.question,
      }, null, 4).replace(/\\\\/g, "\\");
  }

  /**
   * Get the response from chatGPT api
   * @param config
   * @param question
   * @param smart
   * @returns
   */
  function getChatGPTResponse(config, type, userPrompt, smart) {
      return __awaiter(this, void 0, void 0, function* () {
          Logs.info("Getting response with type", type);
          const controller = new AbortController();
          // DEBUG: timeout now at 150s
          const timeoutControler = setTimeout(() => controller.abort(), 150000);
          const req = yield fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${config.apiKey}`,
              },
              signal: config.timeout ? controller.signal : null,
              body: JSON.stringify({
                  model: config.model,
                  messages: [
                      {
                          role: "system",
                          content: type === QuestionType$1.MULTIPLE_CHOICE
                              ? smart
                                  ? getSafeMultipleChoicePrompt(subject)
                                  : getMultipleChoicePrompt()
                              : smart
                                  ? getSafeOpenResponsePrompt(subject)
                                  : getOpenResponsePrompt(),
                      },
                      { role: "user", content: userPrompt },
                  ],
                  temperature: 0.8,
                  top_p: 1.0,
                  presence_penalty: 1.0,
                  stop: null,
              }),
          });
          clearTimeout(timeoutControler);
          const rep = yield req.json();
          const response = rep.choices[0].message.content;
          return parseResponseJson(response, type);
      });
  }

  /**
   * Normlize text
   * @param text
   */
  function normalizeText(text, toLowerCase = false, replaceSingleLine = false) {
      let normalizedText = text
          .replace(/\n+/gi, "\n") //remove duplicate new lines
          .replace(/(\n\s*\n)+/g, "\n") //remove useless white sapce from textcontent
          .replace(/[ \t]+/gi, " "); //replace multiples space or tabs by a space
      if (toLowerCase)
          normalizedText = normalizedText.toLowerCase();
      if (replaceSingleLine) {
          normalizedText = normalizedText.replace(/\n/gi, "");
      }
      return (normalizedText
          .trim()
          /* We remove that because sometimes ChatGPT will reply: "answer d" */
          .replace(/^[a-z\d]\.\s/gi, "") //a. text, b. text, c. text, 1. text, 2. text, 3.text
          .replace(/\n[a-z\d]\.\s/gi, "\n") //same but with new line
      );
  }

  /**
   * Convert table to representating string table
   * @param table
   * @returns
   */
  function htmlTableToString(table) {
      const tab = [];
      const lines = Array.from(table.querySelectorAll("tr"));
      const maxColumnsLength = [];
      lines.map((line) => {
          const cells = Array.from(line.querySelectorAll("td, th"));
          const cellsContent = cells.map((cell, index) => {
              var _a;
              const content = (_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim();
              maxColumnsLength[index] = Math.max(maxColumnsLength[index] || 0, content.length || 0);
              return content;
          });
          tab.push(cellsContent);
      });
      const lineSeparationSize = maxColumnsLength.reduce((a, b) => a + b) + tab[0].length * 3 + 1;
      const lineSeparation = "\n" + Array(lineSeparationSize).fill("-").join("") + "\n";
      const mappedTab = tab.map((line) => {
          const mappedLine = line.map((content, index) => content.padEnd(maxColumnsLength[index], "\u00A0" /* For no matching with \s */));
          return "| " + mappedLine.join(" | ") + " |";
      });
      const head = mappedTab.shift();
      return head + lineSeparation + mappedTab.join("\n");
  }

  /**
   * Clear MathJax elements
   * @param element - The element to clear
   * @returns The cleared element
   */
  function clearMathJax(_element) {
      var _a;
      const element = _element.cloneNode(true);
      const mathJaxElements = element.querySelectorAll(".MathJax");
      for (const mathJaxElement of mathJaxElements) {
          let scriptElement = mathJaxElement.nextElementSibling;
          if (!scriptElement) {
              // try next next sibling of parent
              scriptElement = (_a = mathJaxElement.parentElement) === null || _a === void 0 ? void 0 : _a.nextElementSibling;
          }
          if (scriptElement) {
              // DEBUG
              Logs.info("MathJax script:", scriptElement);
              mathJaxElement.textContent = scriptElement.textContent;
              scriptElement.remove();
          }
          else {
              Logs.error("MathJax script not found:", mathJaxElement);
          }
      }
      return element;
  }

  /**
   * Normalize the question and add sub informations
   * @returns
   */
  function createClosedQuestion(config, _questionContainer, formContainer) {
      if (config.logs) {
          Logs.info("Question container:", _questionContainer);
          Logs.info("Answers container:", formContainer);
      }
      const questionContainer = clearMathJax(_questionContainer);
      // extract .answernumber <span>s, get div after
      const _answerElements = formContainer.querySelectorAll(".answernumber + div");
      const answerElements = [];
      for (const answerElement of _answerElements) {
          answerElements.push(clearMathJax(answerElement));
      }
      let question = questionContainer.innerText;
      if (config.logs)
          Logs.info("Question:", question);
      /* We remove unnecessary information */
      const accesshideElements = formContainer.querySelectorAll(".accesshide");
      for (const useless of accesshideElements) {
          question = question.replace(useless.innerText, "");
      }
      /* Make tables more readable for chat-gpt */
      const tables = formContainer.querySelectorAll(".qtext table");
      for (const table of tables) {
          question = question.replace(table.innerText, "\n" + htmlTableToString(table) + "\n");
      }
      return {
          question: normalizeText(question),
          responses: Array.from(answerElements).map((e) => normalizeText(e.innerText)),
      };
  }
  /**
   * Normalize the question and add sub informations
   * @returns
   */
  function createOpenQuestion(config, _questionContainer) {
      if (config.logs) {
          Logs.info("Question container:", _questionContainer);
      }
      const questionContainer = clearMathJax(_questionContainer);
      let question = questionContainer.innerText;
      if (config.logs)
          Logs.info("Question:", question);
      /* We remove unnecessary information */
      const accesshideElements = questionContainer.querySelectorAll(".accesshide");
      for (const useless of accesshideElements) {
          question = question.replace(useless.innerText, "");
      }
      return {
          question: normalizeText(question),
      };
  }

  /**
   * Handle checkbox and input elements
   * @param config
   * @param answersElem
   * @param inputList
   * @param gptAnswer
   */
  function handleRadioAndCheckbox(config, answersElem, inputList, gptAnswer) {
      let { answer } = gptAnswer.parsed;
      const input = inputList[0];
      // check if radio or checkbox
      if (input.type !== "radio" && input.type !== "checkbox")
          return false;
      if (typeof answer === "string" && !isNaN(Number(answer))) {
          answer = Number(answer);
      }
      if (typeof answer !== "number")
          return false;
      Logs.info("[Radio Handler] Handler radio and checkbox", gptAnswer, answer);
      // select radio inputs, check if value === gptAnswer.answer
      answersElem
          .querySelectorAll("input[type=radio]")
          .forEach((input) => {
          if (input.value.toString() === answer.toString()) {
              input.checked = true;
          }
      });
      return true;
  }

  /**
   * Copy the response in the clipboard if we can automaticaly fill the question
   * @param config
   * @param gptAnswer
   */
  function handleClipboard(config, gptAnswer) {
      if (config.title)
          titleIndications("Copied to clipboard");
      // TODO change to make it work with not-choose-one questions
      navigator.clipboard.writeText(gptAnswer.parsed.answer.toString());
  }

  /**
   * Handle textbox
   * @param config
   * @param answersElem
   * @param inputList
   * @param gptAnswer
   * @returns
   */
  function handleTextbox(config, answersElem, inputList, gptAnswer) {
      const input = inputList[0];
      const answer = gptAnswer.parsed.answer.toString();
      if (inputList.length !== 1 ||
          (input.tagName !== "TEXTAREA" && input.type !== "text")) {
          Logs.info("[Textbox Handler] Not a textbox", inputList, input.tagName, input.type);
          return false;
      }
      Logs.info("[Textbox Handler] Handler textbox", gptAnswer, answer);
      if (config.typing) {
          let index = 0;
          input.addEventListener("keydown", function (event) {
              if (event.key === "Backspace")
                  index = answer.length + 1;
              if (index > answer.length)
                  return;
              event.preventDefault();
              input.value = answer.slice(0, ++index);
          });
      }
      else {
          input.value = answer;
      }
      return true;
  }

  /**
   * Reply to the question
   * @param config
   * @param questionElem
   * @param form
   * @param query
   * @returns
   */
  const reply = function (config, questionElem, form, query, smart) {
      return __awaiter(this, void 0, void 0, function* () {
          if (config.cursor)
              questionElem.style.cursor = "wait";
          const inputList = form.querySelectorAll(query);
          const input = inputList[0];
          // type depends if input is a radio or checkbox (closed question) or text (open question)
          const type = input.type === "radio" || input.type === "checkbox"
              ? QuestionType$1.MULTIPLE_CHOICE
              : QuestionType$1.OPEN_ENDED;
          const question = type === QuestionType$1.MULTIPLE_CHOICE
              ? createClosedQuestion(config, questionElem, form)
              : createOpenQuestion(config, questionElem);
          const answer = form.querySelector(".answer");
          if (config.logs) {
              Logs.question(question);
          }
          let gptAnswer;
          try {
              const prompt = isClosedQuestion
                  ? getClosedPrompt(question)
                  : getOpenPrompt(question);
              if (config.logs) {
                  Logs.info("Prompt:", prompt);
              }
              gptAnswer = yield getChatGPTResponse(config, type, prompt, smart);
          }
          catch (err) {
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
          if (!config.infinite)
              removeListener(questionElem);
          const handlers = [
              // handleContentEditable,
              handleTextbox,
              // handleNumber,
              // handleSelect,
              handleRadioAndCheckbox,
          ];
          for (const handler of handlers) {
              if (handler(config, answer, inputList, gptAnswer))
                  return null;
          }
          Logs.info("No handler found for the question", gptAnswer);
          /* In the case we can't auto complete the question */
          handleClipboard(config, gptAnswer);
      });
  };

  chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
      const config = storage.moodleGPT;
      if (!config)
          throw new Error("Please configure MoodleGPT into the extension");
      if (config.logs) {
          Logs.info(`Started MoodleGPT with model ${config.model} and code ${config.code}`);
      }
      codeListener(config, reply);
  });

}));
//# sourceMappingURL=MoodleGPT.js.map
