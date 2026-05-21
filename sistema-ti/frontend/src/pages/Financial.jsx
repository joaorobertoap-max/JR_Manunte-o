import React from 'react'
import Dashboard from './Dashboard'
import { authFetch } from '../lib/api'

const metrics = [
    { label: 'Receita total', value: 'R$ 0', subtitle: 'Últimos 30 dias', color: '#22c55e' },
    { label: 'Despesas', value: 'R$ 0', subtitle: 'Operações e compras', color: '#ef4444' },
    { label: 'Lucro líquido', value: 'R$ 0', subtitle: 'Depois das despesas', color: '#2563eb' },
    { label: 'Contas a pagar', value: 15, subtitle: 'Vencimento próximo', color: '#f59e0b' }
]

const shortcuts = [
    { icon: '💰', label: 'Fluxo de caixa' },
    { icon: '🧾', label: 'Faturas' },
    { icon: '📥', label: 'Contas a receber' },
    { icon: '📊', label: 'Relatórios' }
]

export default function Financial() {
    const [items, setItems] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [form, setForm] = React.useState({ type: 'income', amount: '', description: '', date: '' })

    const loadItems = async () => {
        setLoading(true)
        try {
            const res = await authFetch('/api/financials')
            const data = await res.json()
            setItems(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        loadItems()
    }, [])

    const handleCreate = async (event) => {
        event.preventDefault()
        try {
            const res = await authFetch('/api/financials', {
                method: 'POST',
                body: JSON.stringify({
                    type: form.type,
                    amount: Number(form.amount) || 0,
                    description: form.description,
                    date: form.date
                })
            })
            if (res.ok) {
                setForm({ type: 'income', amount: '', description: '', date: '' })
                loadItems()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await authFetch(`/api/financials/${id}`, { method: 'DELETE' })
            if (res.ok) loadItems()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dashboard>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h2>Financeiro</h2>
                        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Acompanhe receitas, despesas e resultados financeiros.</p>
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
                            <p>Criar movimento</p>
                            <h2>Registro financeiro</h2>
                        </div>
                    </div>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Tipo
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                <option value="income">Receita</option>
                                <option value="expense">Despesa</option>
                            </select>
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Valor
                            <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Descrição
                            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Data
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                        </label>
                        <button type="submit" style={{ gridColumn: 'span 2', padding: '12px 16px' }}>Salvar movimento</button>
                    </form>
                </div>

                <div className="panel-card" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <p>Lançamentos</p>
                            <h2>Lista atual</h2>
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        {loading ? (
                            <p>Carregando financeiro...</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Tipo</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Valor</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Descrição</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Data</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((f) => (
                                        <tr key={f.id}>
                                            <td style={{ padding: 8 }}>{f.id}</td>
                                            <td style={{ padding: 8 }}>{f.type}</td>
                                            <td style={{ padding: 8 }}>{f.amount}</td>
                                            <td style={{ padding: 8 }}>{f.description}</td>
                                            <td style={{ padding: 8 }}>{f.date}</td>
                                            <td style={{ padding: 8 }}><button onClick={() => handleDelete(f.id)} style={{ color: '#dc2626' }}>Excluir</button></td>
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
