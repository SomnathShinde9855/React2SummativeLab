import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import ProductForm from './components/ProductForm'
import { StoreProvider, useStore } from './context/StoreContext'
import AddProduct from './pages/AddProduct'
import Products from './pages/Products'

function StoreName() {
  const { name } = useStore()
  return <h1>{name}</h1>
}

describe('Store context', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('exposes the storefront name', () => {
    render(
      <StoreProvider>
        <StoreName />
      </StoreProvider>,
    )

    expect(screen.getByRole('heading', { name: /Harbor & Hearth/i })).toBeInTheDocument()
  })

  it('renders the add-product page from a route', () => {
    window.history.pushState({}, '', '/products/new')

    render(<App />)

    expect(screen.getByText(/Publish a new product/i)).toBeInTheDocument()
  })

  it('renders the add-product page from a GitHub Pages-style hash route', () => {
    window.history.pushState({}, '', '/React2SummativeLab/#/products/new')

    render(<App />)

    expect(screen.getByText(/Publish a new product/i)).toBeInTheDocument()
  })

  it('shows a newly created product on the products page', async () => {
    render(
      <StoreProvider>
        <MemoryRouter initialEntries={['/products/new']}>
          <Routes>
            <Route path="/products/new" element={<AddProduct />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </MemoryRouter>
      </StoreProvider>,
    )

    fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Cocoa Reserve' } })
    fireEvent.change(screen.getByLabelText(/origin/i), { target: { value: 'Brazil' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Rich and velvety' } })
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '16.5' } })
    fireEvent.click(screen.getByRole('button', { name: /create product/i }))

    expect(await screen.findByText(/Cocoa Reserve/i)).toBeInTheDocument()
  })

  it('keeps typed values in the product form', () => {
    render(<ProductForm onSubmit={() => {}} />)

    fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Cocoa Reserve' } })
    fireEvent.change(screen.getByLabelText(/origin/i), { target: { value: 'Brazil' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Rich and velvety' } })

    expect(screen.getByLabelText(/product name/i)).toHaveValue('Cocoa Reserve')
    expect(screen.getByLabelText(/origin/i)).toHaveValue('Brazil')
    expect(screen.getByLabelText(/description/i)).toHaveValue('Rich and velvety')
  })
})
