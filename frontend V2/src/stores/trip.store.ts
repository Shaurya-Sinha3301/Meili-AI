import { create } from 'zustand';

interface TripState {
  currentTripId: string | null;
  setCurrentTripId: (id: string | null) => void;
}

export const useTripStore = create<TripState>((set) => ({
  currentTripId: null,
  setCurrentTripId: (currentTripId) => set({ currentTripId }),
}));
