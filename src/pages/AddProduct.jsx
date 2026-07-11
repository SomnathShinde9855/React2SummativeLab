import { useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import { useProducts } from '../hooks/useProducts'

function AddProduct() {
  const navigate = useNavigate()
  const { addProduct } = useProducts()

  const handleSubmit = async (product) => {
    await addProduct(product)
    navigate('/products')
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Create</p>
      <h2>Publish a new product</h2>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create product" title="New product" />
    </section>
  )
}

export default AddProduct
