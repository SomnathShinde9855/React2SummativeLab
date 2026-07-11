import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StoreProvider, useStore } from './context/StoreContext'

function StoreName() {
  const { name } = useStore()
  return <h1>{name}</h1>
}

describe('Store context', () => {
  it('exposes the storefront name', () => {
    render(
      <StoreProvider>
        <StoreName />
      </StoreProvider>,
    )

    expect(screen.getByRole('heading', { name: /Harbor & Hearth/i })).toBeInTheDocument()
  })
})
