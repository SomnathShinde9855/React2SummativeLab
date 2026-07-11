import { NavLink } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

function NavBar() {
  const { name } = useStore()

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Admin dashboard</p>
        <NavLink to="/" className="brand-link">
          <h1>{name}</h1>
        </NavLink>
      </div>

      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products" end>
          Products
        </NavLink>
        <NavLink to="/products/new" end>
          Add product
        </NavLink>
      </nav>
    </header>
  )
}

export default NavBar
