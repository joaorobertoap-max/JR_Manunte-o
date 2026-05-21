import React from 'react'
import Dashboard from './Dashboard'
import { authFetch } from '../lib/api'

const metrics = [
    { label: 'Dispositivos totais', value: 74, subtitle: 'Cadastrados', color: '#2563eb' },
    { label: 'Online', value: 49, subtitle: 'Ativos agora', color: '#22c55e' },
    { label: 'Offline', value: 18, subtitle: 'Aguardando verificação', color: '#f97316' },
    { label: 'Em manutenção', value: 7, subtitle: 'No conserto', color: '#8b5cf6' }
]

const shortcuts = [
    { icon: '💻', label: 'Cadastrar' },
    { icon: '🧰', label: 'Manutenção' },
    { icon: '📊', label: 'Inventário' },
    { icon: '🔍', label: 'Diagnóstico' }
]

export default function Devices() {
    const [devices, setDevices] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [form, setForm] = React.useState({ name: '', serial: '', status: 'online', owner: '' })

    const loadDevices = async () => {
        setLoading(true)
        try {
            const res = await authFetch('/api/devices')
            const data = await res.json()
            setDevices(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        loadDevices()
    }, [])

    const handleCreate = async (event) => {
        event.preventDefault()
        try {
            const res = await authFetch('/api/devices', {
                method: 'POST',
                body: JSON.stringify(form)
            })
            if (res.ok) {
                setForm({ name: '', serial: '', status: 'online', owner: '' })
                loadDevices()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await authFetch(`/api/devices/${id}`, { method: 'DELETE' })
            if (res.ok) loadDevices()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dashboard>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h2>Dispositivos</h2>
                        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Acompanhe e gerencie todos os dispositivos cadastrados.</p>
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
                            <p>Adicionar dispositivo</p>
                            <h2>Novo registro</h2>
                        </div>
                    </div>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Nome
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Serial
                            <input value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Status
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Proprietário
                            <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
                        </label>
                        <button type="submit" style={{ gridColumn: 'span 2', padding: '12px 16px' }}>Salvar dispositivo</button>
                    </form>
                </div>

                <div className="panel-card" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <p>Dispositivos cadastrados</p>
                            <h2>Lista atual</h2>
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        {loading ? (
                            <p>Carregando dispositivos...</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Nome</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Serial</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Proprietário</th>
                                        <th style={{ textAlign: 'left', padding: 8 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {devices.map((d) => (
                                        <tr key={d.id}>
                                            <td style={{ padding: 8 }}>{d.id}</td>
                                            <td style={{ padding: 8 }}>{d.name}</td>
                                            <td style={{ padding: 8 }}>{d.serial}</td>
                                            <td style={{ padding: 8 }}>{d.status}</td>
                                            <td style={{ padding: 8 }}>{d.owner}</td>
                                            <td style={{ padding: 8 }}><button onClick={() => handleDelete(d.id)} style={{ color: '#dc2626' }}>Excluir</button></td>
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
