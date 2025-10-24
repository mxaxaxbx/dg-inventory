export interface QuizI {
  title: string;
  moduleId: string | number; // Changed from moduleId to match JSON
}

export interface QuizzAnswerI {
  answer: string;
  isCorrect: boolean; // Changed from isCorrect to match JSON
}

export interface QuizzQuestionI {
  question: string; // This will handle the nested structure
}

export interface QuizQuestionWithAnswersI {
  question: QuizzQuestionI; // Changed to handle the nested structure
  answers: QuizzAnswerI[];
}

export interface QuizExtructureI {
  quiz: QuizI;
  questions: QuizQuestionWithAnswersI[]; // Changed to match JSON structure
}

export interface QuizzesStateI {
  quizzes: QuizExtructureI[];
}

export const state: QuizzesStateI = {
  quizzes: [],
};
