import { createContext, useContext, useMemo, useState } from 'react'

const StoreContext = createContext(null)

const initialProducts = [
  {
    id: 1,
    description: 'Medium roast with toasted almond and citrus notes.',
    name: 'Vanilla Bean',
    origin: 'Colombia',
    price: 10.5,
  },
  {
    id: 2,
    description: 'Dark roast with rich cocoa and a smoky finish.',
    name: 'House Blend',
    origin: 'Vietnam',
    price: 12,
  },
  {
    id: 3,
    description: 'Bright single origin with berry sweetness and jasmine florals.',
    name: 'Sunrise Reserve',
    origin: 'Ethiopia',
    price: 14.75,
  },
]

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(initialProducts)

  const value = useMemo(
    () => ({
      name: 'Harbor & Hearth',
      description:
        'An AI-ready admin hub for launching new coffee drops, shaping pricing, and keeping inventory fresh.',
      phoneNumber: '555-0148',
      location: 'Vancouver, BC',
      products,
      setProducts,
    }),
    [products],
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
