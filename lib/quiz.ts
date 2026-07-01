/**
 * A light style-personality quiz. Each answer nudges one MBTI axis;
 * the dominant letter on each axis composes the final type.
 */

export type Axis = "EI" | "SN" | "TF" | "JP";

export interface QuizOption {
  label: string;
  axis: Axis;
  /** Which pole this answer votes for, e.g. "E" or "I". */
  pole: string;
}

export interface QuizQuestion {
  question: string;
  options: [QuizOption, QuizOption];
}

export const QUIZ: QuizQuestion[] = [
  {
    question: "You're invited to a big party tonight. Your first instinct?",
    options: [
      { label: "Yes! Time to plan a look that gets noticed", axis: "EI", pole: "E" },
      { label: "Fun... but I'll wear something I can quietly slip away in", axis: "EI", pole: "I" },
    ],
  },
  {
    question: "When you shop, what actually catches your eye first?",
    options: [
      { label: "Practical pieces I know I'll wear a hundred times", axis: "SN", pole: "S" },
      { label: "Something unusual that sparks a whole imagined outfit", axis: "SN", pole: "N" },
    ],
  },
  {
    question: "A friend asks if their outfit works. You...",
    options: [
      { label: "Give them honest, specific fixes — that hem, those shoes", axis: "TF", pole: "T" },
      { label: "Find what's great about it and build their confidence", axis: "TF", pole: "F" },
    ],
  },
  {
    question: "Your wardrobe right now is...",
    options: [
      { label: "Organized by category, color, maybe even season", axis: "JP", pole: "J" },
      { label: "A creative landscape — I know roughly where things live", axis: "JP", pole: "P" },
    ],
  },
  {
    question: "Getting dressed with friends before an event sounds...",
    options: [
      { label: "Perfect — outfits are better as a group project", axis: "EI", pole: "E" },
      { label: "Stressful — I decide best alone with my mirror", axis: "EI", pole: "I" },
    ],
  },
  {
    question: "Your dream clothing item is...",
    options: [
      { label: "The perfect white shirt that fits like it was made for me", axis: "SN", pole: "S" },
      { label: "A one-of-a-kind piece with a story nobody else has", axis: "SN", pole: "N" },
    ],
  },
  {
    question: "You pick outfits based on...",
    options: [
      { label: "Logic: weather, agenda, comfort, dress code", axis: "TF", pole: "T" },
      { label: "Feeling: what matches my mood and the day's energy", axis: "TF", pole: "F" },
    ],
  },
  {
    question: "Tomorrow's outfit is...",
    options: [
      { label: "Already decided, possibly laid out tonight", axis: "JP", pole: "J" },
      { label: "A morning-of decision — depends who I wake up as", axis: "JP", pole: "P" },
    ],
  },
];

export function scoreQuiz(answers: number[]): string {
  const tally: Record<string, number> = {};
  QUIZ.forEach((q, i) => {
    const pick = q.options[answers[i]];
    if (pick) tally[pick.pole] = (tally[pick.pole] ?? 0) + 1;
  });
  const pick = (a: string, b: string) => ((tally[a] ?? 0) >= (tally[b] ?? 0) ? a : b);
  return pick("E", "I") + pick("S", "N") + pick("T", "F") + pick("J", "P");
}
