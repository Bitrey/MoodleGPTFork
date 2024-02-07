const saveBtn = document.querySelector(".save");
const message = document.querySelector("#message");

const fastModelPreference = "gpt-3.5-turbo";
const smartModelPreference = "gpt-4-1106";

/* inputs id */
const inputsText = ["apiKey", "code", "codeSmart"];
const inputsSelect = ["model", "modelSmart"];
const inputsCheckbox = [
  "logs",
  "title",
  "cursor",
  "typing",
  "mouseover",
  "infinite",
  "timeout",
];

const mode = document.querySelector("#mode");
const modes = mode.querySelectorAll("button");
let actualMode = "autocomplete";
/* inputs id that need to be disabled for a specific mode */
const disabledForThisMode = {
  autocomplete: [],
  clipboard: ["typing", "mouseover"],
  "question-to-answer": ["typing", "infinite", "mouseover"],
};

const apiKeySelector = document.querySelector("#apiKey");
const reloadModel = document.querySelector("#reloadModel");
const reloadModelSmart = document.querySelector("#reloadModelSmart");

/**
 * Show message into the popup
 * @param {string} messageTxt - The message to show
 * @param {boolean} valide - If the message is valid or not
 */
function showMessage(messageTxt, valide) {
  message.style.color = valide ? "limegreen" : "red";
  message.textContent = messageTxt;
  message.style.display = "block";
  setTimeout(() => (message.style.display = "none"), 5000);
}

/**
 * Fetch the models from OpenAI
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<string[]>} - The models
 */
async function fetchModels(apiKey) {
  const req = await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const rep = await req.json();
  if (rep.error) {
    throw new Error(rep.error.message);
  }

  const gptModelsAll = rep?.data?.filter((e) => e?.id?.includes("gpt")) || [];
  /** @type {string[]} */
  // sort by "created" date, which is a number
  gptModelsAll.sort((a, b) => parseInt(b.created) - parseInt(a.created));
  const gptModels = gptModelsAll.map((e) => e.id).filter((e) => e);

  // set the message
  showMessage(
    "Fetched " +
      gptModels.length +
      " ChatGPT model" +
      (gptModels.length > 1 ? "s" : ""),
    true,
  );

  // save the models
  const previousConfig = await chrome.storage.sync.get(["moodleGPT"]);
  await chrome.storage.sync.set({
    moodleGPT: {
      ...previousConfig.moodleGPT,
      models: gptModels,
    },
  });

  addModels(gptModels);

  return gptModels;
}

/**
 * Add the models to the model selector
 * @param {string[]} gptModels - The models
 */
function addModels(gptModels) {
  for (const modelSelector of inputsSelect.map((e) =>
    document.querySelector("#" + e),
  )) {
    const curSelected = modelSelector.value;
    const isSmart = modelSelector.id.includes("Smart");

    // remove the old models
    for (const option of modelSelector.querySelectorAll("option")) {
      option.remove();
    }

    // add the new models
    for (const model of gptModels) {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelector.appendChild(option);
    }

    // remove disabled
    modelSelector.removeAttribute("disabled");

    if (curSelected === "none" || !gptModels.includes(curSelected)) {
      const firstPreference = isSmart
        ? smartModelPreference
        : fastModelPreference;

      // this will select the first model if the user didn't select any
      const index = Math.max(
        gptModels.findIndex((e) => e.includes(firstPreference)),
        0,
      );

      modelSelector.selectedIndex = index;
    } else {
      modelSelector.value = curSelected;
    }
  }
}

/**
 * Handle when a mode change to show specific input
 */
function handleModeChange() {
  const needDisable = disabledForThisMode[actualMode];
  const dontNeedDisable = inputsCheckbox.filter(
    (input) => !needDisable.includes(input),
  );
  for (const id of needDisable) {
    document.querySelector("#" + id).parentElement.style.display = "none";
  }
  for (const id of dontNeedDisable) {
    document.querySelector("#" + id).parentElement.style.display = null;
  }
}

/* Mode handler */
modes.forEach((button) => {
  button.addEventListener("click", function () {
    const value = button.value;
    actualMode = value;
    for (const mode of modes) {
      if (mode.value !== value) {
        mode.classList.add("not-selected");
      } else {
        mode.classList.remove("not-selected");
      }
    }
    handleModeChange();
  });
});

/* Save the configuration */
saveBtn.addEventListener("click", async function () {
  const [apiKey, code, codeSmart] = inputsText.map((selector) =>
    document.querySelector("#" + selector).value.trim(),
  );
  const [model, modelSmart] = inputsSelect.map(
    (selector) => document.querySelector("#" + selector).value,
  );
  const [logs, title, cursor, typing, mouseover, infinite, timeout] =
    inputsCheckbox.map((selector) => {
      const element = document.querySelector("#" + selector);
      return element.checked && element.parentElement.style.display !== "none";
    });

  if (!apiKey || !code || !codeSmart || !model || !modelSmart) {
    if (apiKey) {
      showMessage("Please fill all the fields", false);
    } else {
      showMessage("Please provide an API key, then fill all the fields", false);
    }
    return;
  }

  if (code.length < 1) {
    showMessage("The (fast) code should at least contain 1 character");
    return;
  } else if (codeSmart.length < 1) {
    showMessage("The (smart) code should at least contain 1 character");
    return;
  }

  const pastConfig = await chrome.storage.sync.get(["moodleGPT"]);

  chrome.storage.sync.set({
    moodleGPT: {
      ...pastConfig.moodleGPT,
      apiKey,
      code,
      codeSmart,
      model,
      modelSmart,
      logs,
      title,
      cursor,
      typing,
      mouseover,
      infinite,
      timeout,
      mode: actualMode,
    },
  });

  showMessage("Configuration saved", true);
});

/**
 * Check if the API key is provided
 */
function checkAndFillApiKey(apiKey) {
  for (const model of [reloadModel, reloadModelSmart]) {
    if (apiKey) {
      model.removeAttribute("disabled");
      model.setAttribute("title", "Get last ChatGPT version");
    } else {
      model.setAttribute("disabled", true);
      model.setAttribute("title", "Provide an API key first");
    }
  }
  return !!apiKey;
}

function modelsAreLoaded(selector) {
  return (
    selector.querySelectorAll("option").length > 0 && selector.value !== "none"
  );
}

/* we load back the configuration */
chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
  const config = storage.moodleGPT;

  if (config) {
    if (config.mode) {
      actualMode = config.mode;
      for (const mode of modes) {
        if (mode.value === config.mode) {
          mode.classList.remove("not-selected");
        } else {
          mode.classList.add("not-selected");
        }
      }
    }

    if (config.models) {
      addModels(config.models);
    } else if (config.apiKey) {
      fetchModels(config.apiKey).catch((err) => {
        showMessage(err, false);
      });
    }

    [...inputsText, ...inputsSelect].forEach((key) =>
      config[key]
        ? (document.querySelector("#" + key).value = config[key] || "")
        : null,
    );
    inputsCheckbox.forEach(
      (key) => (document.querySelector("#" + key).checked = config[key] || ""),
    );
  }

  apiKeySelector.addEventListener("input", function () {
    apiKey = apiKeySelector.value.trim();
    checkAndFillApiKey(apiKey);
  });

  apiKeySelector.addEventListener("blur", function () {
    if (!config?.apiKey && apiKeySelector.value.trim()) {
      // get last config
      chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
        // save the API key
        chrome.storage.sync.set({
          moodleGPT: {
            ...storage.moodleGPT,
            apiKey: apiKeySelector.value.trim(),
          },
        });
      });
    }
  });

  for (const model of [reloadModel, reloadModelSmart]) {
    model.addEventListener("click", async function () {
      const apiKey = apiKeySelector.value.trim();
      if (!checkAndFillApiKey(apiKey)) {
        return;
      }

      for (const selector of inputsSelect) {
        const modelSelector = document.querySelector("#" + selector);
        if (modelsAreLoaded(modelSelector)) {
          modelSelector.setAttribute("disabled", true);
          modelSelector.setAttribute("title", "Loading models...");
        }
      }
      try {
        await fetchModels(apiKey);
      } catch (err) {
        showMessage(err, false);
      }
    });
  }

  handleModeChange();
  checkAndFillApiKey(config?.apiKey);
});
