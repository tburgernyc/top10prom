'use client'

import { create } from 'zustand'

interface AdminState {
  selectedBoutiqueId: string | null
  setSelectedBoutiqueId: (id: string | null) => void
  analyticsView: 'appointments' | 'boutiques' | 'revenue'
  setAnalyticsView: (view: AdminState['analyticsView']) => void
}

export const useAdminStore = create<AdminState>()((set) => ({
  selectedBoutiqueId: null,
  setSelectedBoutiqueId: (id) => set({ selectedBoutiqueId: id }),
  analyticsView: 'appointments',
  setAnalyticsView: (view) => set({ analyticsView: view }),
}))
