import React from 'react'
import Dashboard from './Dashboard'
import { authFetch } from '../lib/api'
import { getProductImageUrl } from '../lib/productImages'

export default function Products() {
    const [products, setProducts] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [form, setForm] = React.useState({
        name: '',
        sku: '',
        brand: '',
        category: '',
        description: '',
        features: '',
        image_url: '',
        price: '',
        quantity: ''
    })

    const totalProducts = products.length
    const totalStock = products.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    const categoryCount = new Set(products.map((item) => item.category || 'Sem categoria')).size
    const averagePrice = totalProducts ? products.reduce((sum, item) => sum + (Number(item.price) || 0), 0) / totalProducts : 0

    const metrics = [
        { label: 'Produtos ativos', value: totalProducts, subtitle: 'Itens disponíveis', color: '#2563eb' },
        { label: 'Categorias', value: categoryCount, subtitle: 'Tipos de produtos', color: '#14b8a6' },
        { label: 'Estoque total', value: totalStock, subtitle: 'Unidades em mãos', color: '#f59e0b' },
        { label: 'Valor médio', value: `R$ ${averagePrice.toFixed(2)}`, subtitle: 'Preço por item', color: '#8b5cf6' }
    ]

    const loadProducts = async () => {
        setLoading(true)
        try {
            const res = await authFetch('/api/products')
            const data = await res.json()
            setProducts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        loadProducts()
    }, [])

    const handleCreate = async (event) => {
        event.preventDefault()
        try {
            const res = await authFetch('/api/products', {
                method: 'POST',
                body: JSON.stringify({
                    name: form.name,
                    sku: form.sku,
                    brand: form.brand,
                    category: form.category,
                    description: form.description,
                    features: form.features,
                    image_url: form.image_url,
                    price: Number(form.price) || 0,
                    quantity: Number(form.quantity) || 0
                })
            })
            if (res.ok) {
                setForm({ name: '', sku: '', brand: '', category: '', description: '', features: '', image_url: '', price: '', quantity: '' })
                loadProducts()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' })
            if (res.ok) loadProducts()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dashboard>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h2>Produtos</h2>
                        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Catálogo de produtos com imagens, marca, descrição e características.</p>
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
                            <p>Adicionar produto</p>
                            <h2>Novo item</h2>
                        </div>
                    </div>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Nome
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            SKU
                            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Marca
                            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Categoria
                            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Preço
                            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Quantidade
                            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            Imagem URL
                            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                        </label>
                        <label style={{ display: 'grid', gap: 6, gridColumn: 'span 2' }}>
                            Descrição
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                        </label>
                        <label style={{ display: 'grid', gap: 6, gridColumn: 'span 2' }}>
                            Características (separadas por vírgula)
                            <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
                        </label>
                        <button type="submit" style={{ gridColumn: 'span 2', padding: '12px 16px' }}>Salvar produto</button>
                    </form>
                </div>

                <div className="panel-card" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <p>Catálogo de produtos</p>
                            <h2>Itens disponíveis</h2>
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        {loading ? (
                            <p>Carregando produtos...</p>
                        ) : (
                            <div className="product-grid">
                                {products.map((product) => (
                                    <article key={product.id} className="product-card">
                                        <div className="product-card-image">
                                            <img src={getProductImageUrl(product)} alt={product.name} />
                                        </div>
                                        <div className="product-card-body">
                                            <div className="product-card-row">
                                                <div>
                                                    <p className="product-card-meta">{product.category || 'Categoria não definida'}</p>
                                                    <h3>{product.name}</h3>
                                                    <p className="product-card-meta">{product.brand || 'Marca não definida'}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p className="product-card-meta">Preço</p>
                                                    <strong>R$ {Number(product.price).toFixed(2)}</strong>
                                                </div>
                                            </div>

                                            <p style={{ margin: 0, color: '#475569' }}>{product.description || 'Descrição não informada.'}</p>
                                            {product.features && (
                                                <ul className="product-card-features">
                                                    {product.features.split(',').map((item, index) => (
                                                        <li key={index}>{item.trim()}</li>
                                                    ))}
                                                </ul>
                                            )}

                                            <div className="product-status">
                                                <span className="product-card-meta">Quantidade: {product.quantity}</span>
                                                <button className="product-remove" onClick={() => handleDelete(product.id)}>Excluir</button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dashboard>
    )
}
