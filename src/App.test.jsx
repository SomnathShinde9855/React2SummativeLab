import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { StoreProvider, useStore } from './context/StoreContext'

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

  it('renders the add-product page from a hash-based route', () => {
    window.history.pushState({}, '', '/#/products/new')

    render(<App />)

    expect(screen.getByText(/Publish a new product/i)).toBeInTheDocument()
  })
})
