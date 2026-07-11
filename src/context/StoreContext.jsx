import { createContext, useContext, useMemo } from 'react'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const value = useMemo(
    () => ({
      name: 'Harbor & Hearth',
      description:
        'An AI-ready admin hub for launching new coffee drops, shaping pricing, and keeping inventory fresh.',
      phoneNumber: '555-0148',
      location: 'Vancouver, BC',
    }),
    [],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }

  return context
}
