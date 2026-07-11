import { useCallback, useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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
      setProducts(data)
    } catch (err) {
      setError(err.message || 'Unable to load products right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, refreshTick])

  const addProduct = async (product) => {
    const response = await fetch(`${API_URL}/coffee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        price: Number(product.price),
      }),
    })

    if (!response.ok) {
      throw new Error('Product could not be created.')
    }

    const createdProduct = await response.json()
    setProducts((current) => [createdProduct, ...current])
    return createdProduct
  }

  const updateProduct = async (id, updates) => {
    const response = await fetch(`${API_URL}/coffee/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        price: Number(updates.price),
      }),
    })

    if (!response.ok) {
      throw new Error('Product could not be updated.')
    }

    const updatedProduct = await response.json()
    setProducts((current) =>
      current.map((product) => (product.id === id ? updatedProduct : product)),
    )
    return updatedProduct
  }

  const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/coffee/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Product could not be deleted.')
    }

    setProducts((current) => current.filter((product) => product.id !== id))
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
