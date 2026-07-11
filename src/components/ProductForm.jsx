import { useEffect, useId, useState } from 'react'

const emptyValues = {
  name: '',
  origin: '',
  description: '',
  price: '',
}

function ProductForm({ onSubmit, initialValues = {}, submitLabel = 'Save product', title = 'Product details' }) {
  const [formData, setFormData] = useState({ ...emptyValues, ...initialValues })
  const nameId = useId()
  const originId = useId()
  const descriptionId = useId()
  const priceId = useId()

  useEffect(() => {
    setFormData({ ...emptyValues, ...initialValues })
  }, [initialValues])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      ...formData,
      price: Number(formData.price),
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>
      <label htmlFor={nameId}>Product name</label>
      <input id={nameId} name="name" value={formData.name} onChange={handleChange} required />

      <label htmlFor={originId}>Origin</label>
      <input id={originId} name="origin" value={formData.origin} onChange={handleChange} required />

      <label htmlFor={descriptionId}>Description</label>
      <textarea
        id={descriptionId}
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        required
      />

      <label htmlFor={priceId}>Price</label>
      <input
        id={priceId}
        name="price"
        type="number"
        min="0"
        step="0.01"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <button type="submit">{submitLabel}</button>
    </form>
  )
}

export default ProductForm
