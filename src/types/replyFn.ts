import Config from "./config";

type ReplyFn = (
  config: Config,
  questionElem: HTMLElement,
  form: HTMLElement,
  query: string,
) => Promise<string | null>;

export default ReplyFn;
