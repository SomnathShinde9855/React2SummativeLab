import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const STORAGE_KEY = 'harbor-and-hearth-products'

function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
  }
}

function readStoredProducts() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

function writeStoredProducts(products) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function useProducts() {
  const { products, setProducts } = useStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshTick, setRefreshTick] = useState(0)
  const [initialized, setInitialized] = useState(false)

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
      if (storedProducts.length) {
        setProducts(storedProducts)
      }
    } finally {
      setLoading(false)
    }
  }, [setProducts])

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      fetchProducts()
    }
  }, [fetchProducts, initialized])

  const addProduct = async (product) => {
    const normalizedProduct = normalizeProduct(product)
    const fallbackProduct = {
      ...normalizedProduct,
      id: Date.now(),
    }

    const nextProducts = [fallbackProduct, ...products]
    setProducts(nextProducts)
    writeStoredProducts(nextProducts)

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
      const persistedProducts = [normalizeProduct(createdProduct), ...products]
      setProducts(persistedProducts)
      writeStoredProducts(persistedProducts)
      return createdProduct
    } catch {
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
      const nextProducts = products.map((product) =>
        product.id === id ? normalizeProduct(updatedProduct) : product,
      )
      setProducts(nextProducts)
      writeStoredProducts(nextProducts)
      return updatedProduct
    } catch {
      const nextProducts = products.map((product) =>
        product.id === id ? { ...product, ...normalizedUpdates } : product,
      )
      setProducts(nextProducts)
      writeStoredProducts(nextProducts)
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

    const nextProducts = products.filter((product) => product.id !== id)
    setProducts(nextProducts)
    writeStoredProducts(nextProducts)
  }

  return useMemo(
    () => ({
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts: () => setRefreshTick((tick) => tick + 1),
    }),
    [products, loading, error],
  )
}
