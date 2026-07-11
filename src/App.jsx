import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
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
  const routerBaseName = import.meta.env.PROD ? '/React2SummativeLab' : '/'

  return (
    <StoreProvider>
      <BrowserRouter basename={routerBaseName}>
        <RedirectHandler />
        <div className="app-shell">
          <NavBar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<AddProduct />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
