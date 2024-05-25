type GPTClosedQuestion = {
  question: string;
  responses: string[];
};

export const isClosedQuestion = (
  question: GPTClosedQuestion | any,
): question is GPTClosedQuestion => {
  return (
    typeof question === "object" &&
    typeof question.question === "string" &&
    Array.isArray(question.responses) &&
    question.responses.every((r: unknown) => typeof r === "string")
  );
};

export default GPTClosedQuestion;
