import { useCallback, useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const STORAGE_KEY = 'harbor-and-hearth-products'

const fallbackProducts = [
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

function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
  }
}

function readStoredProducts() {
  if (typeof window === 'undefined') {
    return fallbackProducts
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return fallbackProducts
    }

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) && parsedValue.length ? parsedValue : fallbackProducts
  } catch {
    return fallbackProducts
  }
}

function writeStoredProducts(products) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshTick, setRefreshTick] = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/coffee`)

      if (!response.ok) {
        throw new Error('Unable to load products right now.')
      }

      const data = await response.json()
      const normalizedProducts = Array.isArray(data) ? data.map(normalizeProduct) : []
      setProducts(normalizedProducts)
      writeStoredProducts(normalizedProducts)
    } catch {
      const storedProducts = readStoredProducts()
      setProducts(storedProducts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, refreshTick])

  const addProduct = async (product) => {
    const normalizedProduct = normalizeProduct(product)

    try {
      const response = await fetch(`${API_URL}/coffee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedProduct),
      })

      if (!response.ok) {
        throw new Error('Product could not be created.')
      }

      const createdProduct = await response.json()
      setProducts((current) => {
        const nextProducts = [normalizeProduct(createdProduct), ...current]
        writeStoredProducts(nextProducts)
        return nextProducts
      })
      return createdProduct
    } catch {
      const fallbackProduct = {
        ...normalizedProduct,
        id: Date.now(),
      }

      setProducts((current) => {
        const nextProducts = [fallbackProduct, ...current]
        writeStoredProducts(nextProducts)
        return nextProducts
      })

      return fallbackProduct
    }
  }

  const updateProduct = async (id, updates) => {
    const normalizedUpdates = normalizeProduct(updates)

    try {
      const response = await fetch(`${API_URL}/coffee/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedUpdates),
      })

      if (!response.ok) {
        throw new Error('Product could not be updated.')
      }

      const updatedProduct = await response.json()
      setProducts((current) => {
        const nextProducts = current.map((product) =>
          product.id === id ? normalizeProduct(updatedProduct) : product,
        )
        writeStoredProducts(nextProducts)
        return nextProducts
      })
      return updatedProduct
    } catch {
      setProducts((current) => {
        const nextProducts = current.map((product) =>
          product.id === id ? { ...product, ...normalizedUpdates } : product,
        )
        writeStoredProducts(nextProducts)
        return nextProducts
      })

      return { id, ...normalizedUpdates }
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/coffee/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Product could not be deleted.')
      }
    } catch {
      // fall back to local state updates when the API server is unavailable
    }

    setProducts((current) => {
      const nextProducts = current.filter((product) => product.id !== id)
      writeStoredProducts(nextProducts)
      return nextProducts
    })
  }

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: () => setRefreshTick((tick) => tick + 1),
  }
}
