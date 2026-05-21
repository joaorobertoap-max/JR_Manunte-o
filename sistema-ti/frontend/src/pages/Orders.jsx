import React from 'react'
import Dashboard from './Dashboard'
import { authFetch } from '../lib/api'

const metrics = [
    { label: 'Ordens em aberto', value: 18, subtitle: 'Aguardando atendimento', color: '#f59e0b' },
    { label: 'Ordens concluídas', value: 126, subtitle: 'Encerradas', color: '#14b8a6' },
    { label: 'Ordens canceladas', value: 8, subtitle: 'Revisar motivos', color: '#ef4444' },
    { label: 'Tempo médio', value: '3h 25m', subtitle: 'Por ordem', color: '#3b82f6' }
]

const shortcuts = [
    { icon: '🆕', label: 'Nova ordem' },
    { icon: '⏳', label: 'Pendentes' },
    { icon: '✅', label: 'Finalizadas' },
    { icon: '📄', label: 'Relatórios' }
]

export default function Orders() {
    const [orders, setOrders] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [form, setForm] = React.useState({ title: '', customer: '', total: '', status: 'open' })

    const loadOrders = async () => {
        setLoading(true)
        try {
            const res = await authFetch('/api/orders')
            const data = await res.json()
            setOrders(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        loadOrders()
    }, [])

    const handleCreate = async (event) => {
        event.preventDefault()
        try {
            const res = await authFetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify({
                    title: form.title,
                    customer: form.customer,
                    total: Number(form.total) || 0,
                    status: form.status
                })
            })
            if (res.ok) {
                setForm({ title: '', customer: '', total: '', status: 'open' })
                loadOrders()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await authFetch(`/api/orders/${id}`, { method: 'DELETE' })
            if (res.ok) loadOrders()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dashboard>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h2>Ordens</h2>
                        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Visão geral das ordens e operação rápida.</p>
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
                            <p>Criar nova ordem</p>
                            <h2>Registro rápido</h2>
                        </div>
                    </div>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Título
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Cliente
                            <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Total
                            <input type="number" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Status
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                        </label>
                        <button type="submit" style={{ gridColumn: 'span 2', padding: '12px 16px' }}>Salvar ordem</button>
                    </form>
                </div>

                <div className="panel-card" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <p>Ordens cadastradas</p>
                            <h2>Lista atual</h2>
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        {loading ? (
                            <p>Carregando ordens...</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Título</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Cliente</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Total</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o) => (
                                        <tr key={o.id}>
                                            <td style={{ padding: 8 }}>{o.id}</td>
                                            <td style={{ padding: 8 }}>{o.title}</td>
                                            <td style={{ padding: 8 }}>{o.customer}</td>
                                            <td style={{ padding: 8 }}>{o.status}</td>
                                            <td style={{ padding: 8 }}>{o.total}</td>
                                            <td style={{ padding: 8 }}><button onClick={() => handleDelete(o.id)} style={{ color: '#dc2626' }}>Excluir</button></td>
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
