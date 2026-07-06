import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      completedModules: [],
      quizHighScore: 0,
      markModuleComplete: (module) => set(s => ({
        completedModules: [...new Set([...s.completedModules, module])]
      })),
      setQuizHighScore: (score) => set(s => ({
        quizHighScore: Math.max(s.quizHighScore, score)
      })),

      // Exercise-level progress — generic across any module with sub-steps
      // (e.g. Train Your Nose's 16 exercises, or future modules)
      // Shape: { [exerciseId]: true }
      exerciseProgress: {},
      toggleExercise: (exerciseId) => set(s => {
        const next = { ...s.exerciseProgress }
        if (next[exerciseId]) {
          delete next[exerciseId]
        } else {
          next[exerciseId] = true
        }
        return { exerciseProgress: next }
      }),
      isExerciseComplete: (exerciseId) => !!get().exerciseProgress[exerciseId],
      resetExerciseProgress: (exerciseIds) => set(s => {
        const next = { ...s.exerciseProgress }
        exerciseIds.forEach(id => delete next[id])
        return { exerciseProgress: next }
      }),

      // Remembers which "sub-page" (e.g. week/tab) the user was on inside a module,
      // so a refresh doesn't bounce them back to the start.
      // Shape: { [moduleId]: pageIndex }
      modulePosition: {},
      setModulePosition: (moduleId, index) => set(s => ({
        modulePosition: { ...s.modulePosition, [moduleId]: index }
      })),

      journalEntries: [],
      addJournalEntry: (entry) => set(s => ({
        journalEntries: [{ ...entry, id: Date.now(), date: new Date().toISOString() }, ...s.journalEntries]
      })),
      updateJournalEntry: (id, patch) => set(s => ({
        journalEntries: s.journalEntries.map(e => e.id === id ? { ...e, ...patch } : e)
      })),
      deleteJournalEntry: (id) => set(s => ({
        journalEntries: s.journalEntries.filter(e => e.id !== id)
      })),

      lastPlan: null,
      setLastPlan: (plan) => set({ lastPlan: { ...plan, createdAt: new Date().toISOString() } }),

      preferences: {
        experienceLevel: null,
        favoriteStyles: [],
        hasCompletedOnboarding: false,
      },
      setPreferences: (prefs) => set(s => ({
        preferences: { ...s.preferences, ...prefs }
      })),

      // Tracks one-time "intro" cards the user has already seen and dismissed,
      // e.g. the Train Your Nose frequency memo. Generic so future modules
      // can reuse the same mechanism. Shape: { [cardId]: true }
      seenIntroCards: {},
      markIntroCardSeen: (cardId) => set(s => ({
        seenIntroCards: { ...s.seenIntroCards, [cardId]: true }
      })),
    }),
    { name: 'palate-storage', version: 2 }
  )
)
