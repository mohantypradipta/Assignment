import { create } from 'zustand';

export interface TriageStore {
  currentQuestion: number;
  answers: Record<number, number>;
  totalScore: number;
  setAnswer: (questionNumber: number, score: number) => void;
  goToQuestion: (questionNumber: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetQuestionnaire: () => void;
  calculateScore: () => number;
}

export const useTriageStore = create<TriageStore>((set, get) => ({
  currentQuestion: 1,
  answers: {},
  totalScore: 0,

  setAnswer: (questionNumber: number, score: number) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionNumber]: score,
      },
    })),

  goToQuestion: (questionNumber: number) =>
    set(() => ({
      currentQuestion: questionNumber,
    })),

  nextQuestion: () =>
    set((state) => ({
      currentQuestion: Math.min(state.currentQuestion + 1, 5),
    })),

  previousQuestion: () =>
    set((state) => ({
      currentQuestion: Math.max(state.currentQuestion - 1, 1),
    })),

  resetQuestionnaire: () =>
    set(() => ({
      currentQuestion: 1,
      answers: {},
      totalScore: 0,
    })),

  calculateScore: () => {
    const state = get();
    const score = Object.values(state.answers).reduce((sum, val) => sum + val, 0);
    set(() => ({ totalScore: score }));
    return score;
  },
}));
