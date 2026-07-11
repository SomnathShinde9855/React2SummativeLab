import { Link } from 'react-router-dom'
import AIAssistant from '../components/AIAssistant'
import { useStore } from '../context/StoreContext'
import { useProducts } from '../hooks/useProducts'

function Home() {
  const { name, description, phoneNumber, location } = useStore()
  const { products, loading } = useProducts()
  const featured = products.slice(0, 2)

  return (
    <section className="home-grid">
      <div className="hero-card">
        <p className="eyebrow">Curated commerce</p>
        <h2>Launch your next coffee drop with confidence.</h2>
        <p className="lead">{description}</p>

        <div className="stats-row">
          <div>
            <strong>{products.length}</strong>
            <span>Products live</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>AI assist</span>
          </div>
          <div>
            <strong>{phoneNumber}</strong>
            <span>{location}</span>
          </div>
        </div>

        <div className="button-row">
          <Link to="/products" className="primary-btn">
            Review products
          </Link>
          <Link to="/products/new" className="secondary-btn">
            Add a new product
          </Link>
        </div>
      </div>

      <aside className="info-card">
        <p className="eyebrow">Spotlight</p>
        <h3>{name}</h3>
        <p>Monitor price changes, publish fresh inventory, and keep your storefront search-ready.</p>
        {loading ? <p>Loading featured picks...</p> : null}
        <ul>
          {featured.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong>
              <span>from {product.origin}</span>
            </li>
          ))}
        </ul>
      </aside>

      <AIAssistant />
    </section>
  )
}

export default Home
