import Config from "./config";
import QuestionType from "./questionType";

type ReplyFn = (
  config: Config,
  questionElem: HTMLElement,
  form: HTMLElement,
  query: string,
  smart: boolean,
) => Promise<string | null>;

export default ReplyFn;
