import { useEffect } from 'react'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import { StoreProvider } from './context/StoreContext'
import AddProduct from './pages/AddProduct'
import Home from './pages/Home'
import Products from './pages/Products'

function RedirectHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirectPath = params.get('redirect')

    if (redirectPath) {
      navigate(redirectPath.replace('/React2SummativeLab', '') || '/', { replace: true })
    }
  }, [navigate])

  return null
}

function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <RedirectHandler />
        <div className="app-shell">
          <NavBar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<AddProduct />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </StoreProvider>
  )
}

export default App
