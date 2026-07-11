import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import { useProducts } from '../hooks/useProducts'

function Products() {
  const { products, loading, error, updateProduct, deleteProduct } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [feedback, setFeedback] = useState('')
  const searchId = useId()
  const searchRef = useRef(null)

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return products
    }

    return products.filter((product) => {
      return [product.name, product.origin, product.description].some((value) =>
        value.toLowerCase().includes(term),
      )
    })
  }, [products, searchTerm])

  const selectedProduct = products.find((product) => product.id === selectedProductId) || null

  const handleEdit = async (formData) => {
    if (!selectedProduct) {
      return
    }

    try {
      await updateProduct(selectedProduct.id, formData)
      setFeedback(`${selectedProduct.name} updated successfully.`)
    } catch (submitError) {
      setFeedback(submitError.message || 'Unable to update this product right now.')
    }
  }

  const handleDelete = async (product) => {
    try {
      await deleteProduct(product.id)
      setFeedback(`${product.name} removed from the catalog.`)

      if (selectedProductId === product.id) {
        setSelectedProductId(null)
      }
    } catch (submitError) {
      setFeedback(submitError.message || 'Unable to remove this product right now.')
    }
  }

  return (
    <section className="products-shell">
      <div className="products-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Manage stock and prices</h2>
        </div>
        <Link to="/products/new" className="primary-btn">
          + Add product
        </Link>
      </div>

      <div className="content-grid">
        <div className="product-list-card">
          <label htmlFor={searchId} className="search-label">
            Search products
          </label>
          <input
            ref={searchRef}
            id={searchId}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Try 'vanilla' or 'vietnam'"
          />

          {loading ? <p>Loading products...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          <div className="product-list">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <div className="product-meta">
                  <span>{product.origin}</span>
                  <strong>${Number(product.price).toFixed(2)}</strong>
                </div>
                <div className="card-actions">
                  <button type="button" onClick={() => setSelectedProductId(product.id)}>
                    Edit
                  </button>
                  <button type="button" className="danger-btn" onClick={() => handleDelete(product)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="editor-card">
          {feedback ? <p className="feedback">{feedback}</p> : null}

          {selectedProduct ? (
            <ProductForm
              initialValues={selectedProduct}
              title={`Edit ${selectedProduct.name}`}
              submitLabel="Update product"
              onSubmit={handleEdit}
            />
          ) : (
            <div className="empty-editor">
              <p className="eyebrow">Editor</p>
              <h3>Select a product to update its price or story.</h3>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Products
