export type ParsedGPTAnswer = {
  answer: number | string;
};

type GPTAnswer = {
  rawResponse: string;
  parsed: ParsedGPTAnswer | null;
  error: string | null;
};

export default GPTAnswer;
