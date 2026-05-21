import React from 'react'
import Dashboard from './Dashboard'
import { authFetch } from '../lib/api'

const metrics = [
    { label: 'Total de usuários', value: 1, subtitle: 'Contas cadastradas', color: '#2563eb' },
    { label: 'Usuários ativos', value: 1, subtitle: 'Online agora', color: '#14b8a6' },
    { label: 'Novos registros', value: 1, subtitle: 'Últimos 7 dias', color: '#f59e0b' },
    { label: 'Perfis administradores', value: 1, subtitle: 'Acesso total', color: '#a855f7' }
]

const shortcuts = [
    { icon: '➕', label: 'Novo usuário' },
    { icon: '🛡️', label: 'Permissões' },
    { icon: '📧', label: 'Notificações' },
    { icon: '⚙️', label: 'Configurações' }
]

export default function Users() {
    const [users, setUsers] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [form, setForm] = React.useState({ name: '', email: '', role: 'user', password: '' })

    const loadUsers = async () => {
        setLoading(true)
        try {
            const res = await authFetch('/api/users')
            const data = await res.json()
            setUsers(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        loadUsers()
    }, [])

    const handleCreate = async (event) => {
        event.preventDefault()
        try {
            const res = await authFetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(form)
            })
            if (res.ok) {
                setForm({ name: '', email: '', role: 'user', password: '' })
                loadUsers()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await authFetch(`/api/users/${id}`, { method: 'DELETE' })
            if (res.ok) loadUsers()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dashboard>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h2>Usuários</h2>
                        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Monitoramento e ações rápidas do cadastro de usuários.</p>
                    </div>
                </div>

                <div className="status-cards" style={{ marginTop: 24, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
                    {metrics.map((item) => (
                        <article key={item.label} className="status-card" style={{ borderTop: `4px solid ${item.color}` }}>
                            <div className="status-card-head">
                                <p>{item.label}</p>
                                <span>{item.subtitle}</span>
                            </div>
                            <h2>{item.value}</h2>
                        </article>
                    ))}
                </div>

                <div className="panel-card" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <p>Adicionar usuário</p>
                            <h2>Novo cadastro</h2>
                        </div>
                    </div>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Nome
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Email
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Role
                            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Senha
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        </label>
                        <button type="submit" style={{ gridColumn: 'span 2', padding: '12px 16px' }}>Salvar usuário</button>
                    </form>
                </div>

                <div className="panel-card" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <p>Usuários cadastrados</p>
                            <h2>Lista atual</h2>
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        {loading ? (
                            <p>Carregando usuários...</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Nome</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Role</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id}>
                                            <td style={{ padding: 8 }}>{u.id}</td>
                                            <td style={{ padding: 8 }}>{u.name}</td>
                                            <td style={{ padding: 8 }}>{u.email}</td>
                                            <td style={{ padding: 8 }}>{u.role}</td>
                                            <td style={{ padding: 8 }}><button onClick={() => handleDelete(u.id)} style={{ color: '#dc2626' }}>Excluir</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </Dashboard>
    )
}
