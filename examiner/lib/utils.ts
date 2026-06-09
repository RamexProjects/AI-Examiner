import { Question, QuestionType } from '@/types';

export const QUIZ_CONSTANTS = {
  DEFAULT_QUESTION_COUNT: 10,
  SURVIVAL_QUESTION_COUNT: 10,
  SURVIVAL_MC_COUNT: 7,
  SURVIVAL_TF_COUNT: 3,
  GRADING_DELAY_MS: 2000,
  SURVIVAL_GAME_OVER_DELAY_MS: 1500,
  TIMER: {
    Easy: 15,
    Medium: 20,
    Hard: 25,
  },
  STREAK_FIRE_THRESHOLD: 2,
  PASSING_PERCENTAGE: 70,
  SHORT_ANSWER: {
    MIN_SUBSTRING_LENGTH: 4,
    SIMILARITY_THRESHOLD: 0.8,
    WORD_MATCH_THRESHOLD: 0.7,
    WORD_SIMILARITY_THRESHOLD: 0.75,
  },
} as const;

export const decodeHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
};

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
  'under', 'again', 'then', 'once', 'here', 'there', 'when', 'where',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'because', 'but', 'and', 'or',
  'if', 'then', 'else', 'this', 'that', 'these', 'those', 'it', 'its',
]);

function levenshteinDist(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function stringSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDist(a, b) / maxLen;
}

function stripPunctuation(s: string): string {
  return s.replace(/[.,!?;:""''()\[\]{}@#$%^&*+=<>~`|/\\]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeExact(s: string): string {
  if (!s) return "";
  return decodeHtml(s).trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function normalizeShortAnswer(s: string): string {
  if (!s) return "";
  return stripPunctuation(normalizeExact(s));
}

function tokenize(s: string): string[] {
  return s.split(/\s+/).filter(Boolean);
}

function significantTokens(s: string): string[] {
  return tokenize(s).filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export function isAnswerCorrect(userAns: string, correctAns: string, type: QuestionType): boolean {
  if (!userAns || !correctAns) return false;

  // --------------- MC / True-False: exact comparison ---------------
  if (type !== 'Short Answer') {
    return normalizeExact(userAns) === normalizeExact(correctAns);
  }

  // --------------- Short Answer: multi-strategy ---------------
  const user = normalizeShortAnswer(userAns);
  const correct = normalizeShortAnswer(correctAns);

  if (!user || !correct) return false;

  // 1. Exact match
  if (user === correct) return true;

  // 2. Full-string similarity (handles typos: "recieve" vs "receive")
  if (user.length > 3 && correct.length > 3 &&
      stringSimilarity(user, correct) >= QUIZ_CONSTANTS.SHORT_ANSWER.SIMILARITY_THRESHOLD) {
    return true;
  }

  // 3. Significant-token matching (handles rephrasing)
  //    e.g., "JavaScript array methods" vs "methods of array in JS"
  const userSig = significantTokens(user);
  const correctSig = significantTokens(correct);

  if (userSig.length > 0 && correctSig.length > 0) {
    const [shorter, longer] = userSig.length <= correctSig.length
      ? [userSig, correctSig]
      : [correctSig, userSig];

    let matches = 0;
    const matched = new Set<number>();

    for (const sw of shorter) {
      for (let i = 0; i < longer.length; i++) {
        if (matched.has(i)) continue;
        if (sw === longer[i] ||
            (sw.length > 3 && longer[i].length > 3 &&
             stringSimilarity(sw, longer[i]) >= QUIZ_CONSTANTS.SHORT_ANSWER.WORD_SIMILARITY_THRESHOLD)) {
          matches++;
          matched.add(i);
          break;
        }
      }
    }

    if (matches / shorter.length >= QUIZ_CONSTANTS.SHORT_ANSWER.WORD_MATCH_THRESHOLD) {
      return true;
    }
  }

  // 4. Substring containment (e.g., "react" inside "react js")
  const minLen = QUIZ_CONSTANTS.SHORT_ANSWER.MIN_SUBSTRING_LENGTH;
  if (user.length >= minLen && correct.includes(user)) return true;
  if (correct.length >= minLen && user.includes(correct)) return true;

  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateQuestions(data: unknown): data is Question[] {
  if (!Array.isArray(data)) return false;
  return data.every((item) =>
    isRecord(item) &&
    typeof item.id === 'number' &&
    typeof item.question === 'string' &&
    typeof item.correctAnswer === 'string' &&
    typeof item.explanation === 'string' &&
    typeof item.type === 'string' &&
    ['True/False', 'Multiple Choice', 'Short Answer', 'Mixed'].includes(item.type)
  );
}
