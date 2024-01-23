import { codeListener } from "./core/code-listener";
import reply from "./core/reply";
import Config from "./types/config";
import Logs from "./utils/logs";

chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
  const config: Config | undefined = storage.moodleGPT;

  if (!config) throw new Error("Please configure MoodleGPT into the extension");

  if (config.logs) {
    Logs.info(
      `Started MoodleGPT with model ${config.model} and code ${config.code}`,
    );
  }

  codeListener(config, reply);
});
