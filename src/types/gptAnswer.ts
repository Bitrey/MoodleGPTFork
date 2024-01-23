export type ParsedGPTAnswer = {
  guess: number;
};

type GPTAnswer = {
  rawResponse: string;
  parsed: ParsedGPTAnswer | null;
  error: string | null;
};

export default GPTAnswer;
