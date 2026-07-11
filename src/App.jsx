import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import { StoreProvider } from './context/StoreContext'
import AddProduct from './pages/AddProduct'
import Home from './pages/Home'
import Products from './pages/Products'

function App() {
  const routerBasename = import.meta.env.PROD ? '/React2SummativeLab' : '/'

  return (
    <StoreProvider>
      <BrowserRouter basename={routerBasename}>
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
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
