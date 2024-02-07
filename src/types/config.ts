export const subject = "Numerical Analysis";

type Config = {
  apiKey: string;
  code: string;
  codeSmart: string;
  model?: string;
  modelSmart?: string;
  models?: string[];
  infinite?: boolean;
  typing?: boolean;
  mouseover?: boolean;
  cursor?: boolean;
  logs?: boolean;
  title?: boolean;
  timeout?: boolean;
  mode?: "autocomplete" | "question-to-answer" | "clipboard";
};

export default Config;
