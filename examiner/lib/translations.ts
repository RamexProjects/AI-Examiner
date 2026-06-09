export type Language = 'en' | 'am';

type TranslationMap = {
  [key: string]: { en: string; am: string };
};

export const translations: TranslationMap = {
  appTitle: { en: 'AI-Examiner', am: 'AI-ፈታኝ' },
  appDescription: { en: 'Generate quizzes on any topic using AI', am: 'በማንኛውም ርዕስ ላይ AI በመጠቀም ፈተናዎችን ይፍጠሩ' },

  // Mode tabs
  standard: { en: 'Standard', am: 'መደበኛ' },
  survival: { en: 'Survival', am: 'መትረፍ' },

  // QuizConfig
  quizSetup: { en: 'Quiz Setup', am: 'የፈተና ዝግጅት' },
  survivalModeTitle: { en: 'Survival Mode', am: 'የመትረፍ ሁነታ' },
  customizeSettings: { en: 'Customize your quiz settings below.', am: 'ከታች የፈተና ቅንብሮችዎን ያብጁ።' },
  survivalDescription: { en: 'One wrong answer and it is Game Over.', am: 'አንድ የተሳሳተ መልስ እና ጨዋታው ያልቃል።' },
  topicLabel: { en: 'Topic', am: 'ርዕሰ ጉዳይ' },
  difficultyLabel: { en: 'Difficulty', am: 'ችግረኛነት' },
  questionTypeLabel: { en: 'Question Type', am: 'የጥያቄ አይነት' },
  easy: { en: 'Easy', am: 'ቀላል' },
  medium: { en: 'Medium', am: 'መካከለኛ' },
  hard: { en: 'Hard', am: 'ከባድ' },
  multipleChoice: { en: 'Multiple Choice', am: 'በርካታ ምርጫ' },
  trueFalse: { en: 'True / False', am: 'እውነት / ሐሰት' },
  shortAnswer: { en: 'Short Answer', am: 'አጭር መልስ' },
  startStandard: { en: 'Start Standard Quiz', am: 'መደበኛ ፈተና ይጀምሩ' },
  startSurvival: { en: 'Start Survival Run', am: 'የመትረፍ ሩጫ ይጀምሩ' },
  generating: { en: 'Generating...', am: 'በማዘጋጀት ላይ...' },
  placeholderStandard: { en: 'e.g. JavaScript Basics...', am: 'ለምሳሌ የጃቫስክሪፕት መሰረቶች...' },
  placeholderSurvival: { en: 'e.g. React basics...', am: 'ለምሳሌ የሪአክት መሰረቶች...' },
  languageLabel: { en: 'Language', am: 'ቋንቋ' },
  english: { en: 'English', am: 'እንግሊዝኛ' },
  amharic: { en: 'Amharic', am: 'አማርኛ' },

  // QuizGame
  question: { en: 'Question', am: 'ጥያቄ' },
  survivalMode: { en: 'Survival Mode', am: 'የመትረፍ ሁነታ' },
  untimed: { en: 'Untimed', am: 'ያለ ጊዜ' },
  typeHere: { en: 'Type your answer here...', am: 'መልስዎን እዚህ ይጻፉ...' },
  submitAnswer: { en: 'Submit Answer', am: 'መልሱን ያስገቡ' },
  result: { en: 'Result', am: 'ውጤት' },
  correct: { en: 'Correct! 🎉', am: 'ትክክል! 🎉' },
  wrong: { en: 'Wrong! 😬', am: 'ስህተት! 😬' },
  finish: { en: 'Finish', am: 'ጨርስ' },
  next: { en: 'Next', am: 'ቀጣይ' },
  gameOver: { en: 'GAME OVER...', am: 'ጨዋታ አልቋል...' },

  // ValuationPage
  missionAccomplished: { en: 'Mission Accomplished!', am: 'ተልዕኮ ተፈጽሟል!' },
  survivalRunEnded: { en: 'Survival Run Ended', am: 'የመትረፍ ሩጫ አልቋል' },
  quizResults: { en: 'Quiz Results', am: 'የፈተና ውጤቶች' },
  levelsCleared: { en: 'Levels Cleared', am: 'የተሻገሩ ደረጃዎች' },
  madeItTo: { en: 'You made it to question', am: 'ደርሰዋል እስከ ጥያቄ' },
  scored: { en: 'You scored', am: 'ውጤትዎ' },
  outOf: { en: 'out of', am: 'ከ' },
  correctLabel: { en: 'Correct', am: 'ትክክል' },
  incorrect: { en: 'Incorrect', am: 'ስህተት' },
  yourAnswer: { en: 'Your Answer', am: 'የእርስዎ መልስ' },
  correctAnswer: { en: 'Correct Answer', am: 'ትክክለኛ መልስ' },
  notAvailable: { en: 'Not Available', am: 'አይገኝም' },
  explanation: { en: 'Explanation:', am: 'ማብራሪያ:' },
  noExplanation: { en: 'No explanation provided.', am: 'ምንም ማብራሪያ አልተሰጠም።' },
  tryAgain: { en: 'Try Again', am: 'እንደገና ሞክር' },
  startNewQuiz: { en: 'Start New Quiz', am: 'አዲስ ፈተና ይጀምሩ' },

  // Errors
  aiOverloaded: { en: 'AI is Overloaded', am: 'AI ከመጠን በላይ ጫን ይዞታል' },
  aiOverloadedDesc: { en: 'Too many people are generating quizzes right now.', am: 'በአሁኑ ጊዜ ብዙ ሰዎች ፈተና እየፈጠሩ ነው።' },
  somethingWentWrong: { en: 'Something went wrong', am: 'አንድ ስህተት ተከስቷል' },
  couldNotGenerate: { en: "We couldn't generate the quiz.", am: 'ፈተናውን መፍጠር አልተቻለም።' },
  back: { en: 'Back', am: 'ተመለስ' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}
