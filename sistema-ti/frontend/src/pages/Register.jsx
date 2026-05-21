import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../lib/api'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            })

            if (!response.ok) {
                const body = await response.json()
                setError(body.error || 'Falha no cadastro')
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
                <h1 style={{ marginBottom: 12 }}>Cadastrar</h1>
                <p style={{ marginBottom: 24, color: '#475569' }}>Crie sua conta para acessar o sistema.</p>
                {error && <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: '#fee2e2', color: '#991b1b' }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                    <label style={{ display: 'grid', gap: 8 }}>
                        Nome
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} />
                    </label>

                    <label style={{ display: 'grid', gap: 8 }}>
                        Email
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} />
                    </label>

                    <label style={{ display: 'grid', gap: 8 }}>
                        Senha
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} />
                    </label>

                    <label style={{ display: 'grid', gap: 8 }}>
                        Perfil
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }}>
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </label>

                    <button type="submit" disabled={loading} style={{ padding: 14, borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}
