import { useEffect, useId, useState } from 'react'

const emptyValues = {
  name: '',
  origin: '',
  description: '',
  price: '',
}

function ProductForm({ onSubmit, initialValues, submitLabel = 'Save product', title = 'Product details' }) {
  const [formData, setFormData] = useState({ ...emptyValues, ...(initialValues || {}) })
  const nameId = useId()
  const originId = useId()
  const descriptionId = useId()
  const priceId = useId()

  const initialValuesSignature = initialValues
    ? `${initialValues.id ?? 'new'}-${initialValues.name ?? ''}-${initialValues.origin ?? ''}-${initialValues.description ?? ''}-${initialValues.price ?? ''}`
    : 'new'

  useEffect(() => {
    setFormData({ ...emptyValues, ...(initialValues || {}) })
  }, [initialValuesSignature])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedValues = {
      name: formData.name?.trim() || '',
      origin: formData.origin?.trim() || '',
      description: formData.description?.trim() || '',
      price: String(formData.price ?? '').trim(),
    }

    if (!trimmedValues.name || !trimmedValues.origin || !trimmedValues.description || trimmedValues.price === '') {
      return
    }

    onSubmit({
      ...trimmedValues,
      price: Number(trimmedValues.price),
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
