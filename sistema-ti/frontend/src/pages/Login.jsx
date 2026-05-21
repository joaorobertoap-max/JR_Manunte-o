import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../lib/api'

export default function Login() {
    const [email, setEmail] = useState('admin@example.com')
    const [password, setPassword] = useState('secret')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                const body = await response.json()
                setError(body.error || 'Falha no login')
                return
            }

            const data = await response.json()
            setToken(data.token)
            navigate('/')
        } catch (err) {
            setError('Erro ao conectar com o servidor')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.1)', padding: 32 }}>
                <h1 style={{ marginBottom: 12 }}>Entrar</h1>
                <p style={{ marginBottom: 24, color: '#475569' }}>Acesse o sistema usando sua conta.</p>
                {error && <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: '#fee2e2', color: '#991b1b' }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                    <label style={{ display: 'grid', gap: 8 }}>
                        Email
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} />
                    </label>

                    <label style={{ display: 'grid', gap: 8 }}>
                        Senha
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} />
                    </label>

                    <button type="submit" disabled={loading} style={{ padding: 14, borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <div style={{ marginTop: 16, color: '#475569' }}>
                    <span>Não tem conta? </span>
                    <a href="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>Cadastre-se</a>
                </div>
            </div>
        </div>
    )
}
