import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ProductForm from '../components/ProductForm'
import { useProducts } from '../hooks/useProducts'

function AddProduct() {
  const navigate = useNavigate()
  const { addProduct } = useProducts()
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (product) => {
    setError('')
    setFeedback('')

    const createdProduct = await addProduct(product)

    if (createdProduct) {
      setFeedback(`${createdProduct.name} was added successfully.`)
      window.setTimeout(() => navigate('/products'), 300)
    } else {
      setError('Unable to add product right now.')
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Create</p>
      <h2>Publish a new product</h2>
      {feedback ? <p className="feedback">{feedback}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <ProductForm onSubmit={handleSubmit} submitLabel="Create product" title="New product" />
    </section>
  )
}

export default AddProduct
