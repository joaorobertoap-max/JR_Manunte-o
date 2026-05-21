import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Orders from './pages/Orders'
import Stock from './pages/Stock'
import Devices from './pages/Devices'
import Financial from './pages/Financial'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function RequireAuth({ children }) {
  const token = localStorage.getItem('authToken')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/empresa" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/users" element={<RequireAuth><Users /></RequireAuth>} />
      <Route path="/usuarios" element={<RequireAuth><Users /></RequireAuth>} />
      <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
      <Route path="/ordens" element={<RequireAuth><Orders /></RequireAuth>} />
      <Route path="/stock" element={<RequireAuth><Stock /></RequireAuth>} />
      <Route path="/estoque" element={<RequireAuth><Stock /></RequireAuth>} />
      <Route path="/devices" element={<RequireAuth><Devices /></RequireAuth>} />
      <Route path="/dispositivos" element={<RequireAuth><Devices /></RequireAuth>} />
      <Route path="/financial" element={<RequireAuth><Financial /></RequireAuth>} />
      <Route path="/financeiro" element={<RequireAuth><Financial /></RequireAuth>} />
      <Route path="/products" element={<RequireAuth><Products /></RequireAuth>} />
      <Route path="/produtos" element={<RequireAuth><Products /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
