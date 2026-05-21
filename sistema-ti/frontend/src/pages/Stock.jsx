import React from 'react'
import Dashboard from './Dashboard'
import { authFetch } from '../lib/api'
import { getProductImageUrl } from '../lib/productImages'

const shortcuts = [
    { icon: '📦', label: 'Produtos' },
    { icon: '🔍', label: 'Buscar' },
    { icon: '💰', label: 'Valor' },
    { icon: '📊', label: 'Estoque' }
]

export default function Stock() {
    const [products, setProducts] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [query, setQuery] = React.useState('')

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

    const filteredProducts = products.filter((product) => {
        const value = query.toLowerCase()
        return (
            product.name?.toLowerCase().includes(value) ||
            product.brand?.toLowerCase().includes(value) ||
            product.category?.toLowerCase().includes(value) ||
            product.description?.toLowerCase().includes(value)
        )
    })

    const totalStock = products.reduce((sum, product) => sum + (Number(product.quantity) || 0), 0)
    const averagePrice = products.length
        ? products.reduce((sum, product) => sum + (Number(product.price) || 0), 0) / products.length
        : 0

    const categorySummary = products.reduce((summary, product) => {
        const category = product.category || 'Sem categoria'
        summary[category] = (summary[category] || 0) + (Number(product.quantity) || 0)
        return summary
    }, {})

    const categoryColors = {
        'Memória': '#f97316',
        'Armazenamento': '#2563eb',
        'Bateria': '#ef4444',
        'Fonte': '#22c55e',
        'Sem categoria': '#a855f7'
    }

    const categoryCards = Object.entries(categorySummary).map(([category, quantity]) => ({
        category,
        quantity,
        color: categoryColors[category] || '#0ea5e9'
    }))

    return (
        <Dashboard>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h2>Estoque</h2>
                        <p style={{ margin: '8px 0 0', color: '#64748b' }}>
                            Produtos em estoque com imagens, marca, categoria, preço e descrição.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                            placeholder="Buscar produto, marca ou categoria"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #d1d5db', minWidth: 280 }}
                        />
                    </div>
                </div>

                <div className="status-cards" style={{ marginTop: 24, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                    <article className="status-card" style={{ borderTop: '4px solid #2563eb' }}>
                        <div className="status-card-head">
                            <p>Produtos cadastrados</p>
                            <span>Total no catálogo</span>
                        </div>
                        <h2>{products.length}</h2>
                    </article>
                    <article className="status-card" style={{ borderTop: '4px solid #22c55e' }}>
                        <div className="status-card-head">
                            <p>Quantidade total</p>
                            <span>Unidades em estoque</span>
                        </div>
                        <h2>{totalStock}</h2>
                    </article>
                    <article className="status-card" style={{ borderTop: '4px solid #f59e0b' }}>
                        <div className="status-card-head">
                            <p>Preço médio</p>
                            <span>Valor por item</span>
                        </div>
                        <h2>R$ {averagePrice.toFixed(2)}</h2>
                    </article>
                </div>

                <div style={{ marginTop: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ margin: 0, color: '#94a3b8' }}>Estoque de peças</p>
                            <h2 style={{ margin: '8px 0 0' }}>Resumo por categoria</h2>
                        </div>
                        <input
                            className="stock-search"
                            placeholder="Buscar produto, marca ou categoria"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="stock-category-grid">
                        {categoryCards.map((card) => (
                            <div key={card.category} className="stock-category-card" style={{ background: card.color }}>
                                <div>
                                    <p style={{ margin: 0, opacity: 0.9 }}>{card.category}</p>
                                </div>
                                <strong>{card.quantity}</strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel-card" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <p>Produtos em estoque</p>
                            <h2>Catálogo</h2>
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        {loading ? (
                            <p>Carregando produtos...</p>
                        ) : (
                            <div style={{ display: 'grid', gap: 16 }}>
                                {filteredProducts.map((product) => (
                                    <article key={product.id} className="product-card" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                                        <div style={{ minWidth: 260, borderRadius: 12, overflow: 'hidden', background: '#f8fafc' }}>
                                            <img
                                                src={getProductImageUrl(product)}
                                                alt={product.name}
                                                style={{ width: '100%', objectFit: 'cover', minHeight: 180 }}
                                            />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                                                <div>
                                                    <p style={{ color: '#64748b', margin: 0 }}>{product.category || 'Categoria não definida'}</p>
                                                    <h3 style={{ margin: '8px 0' }}>{product.name}</h3>
                                                    <p style={{ margin: 0, color: '#475569' }}>{product.brand || 'Marca não definida'}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ margin: 0, color: '#64748b' }}>Preço</p>
                                                    <strong style={{ fontSize: 20 }}>R$ {Number(product.price).toFixed(2)}</strong>
                                                </div>
                                            </div>
                                            <p style={{ margin: '12px 0', color: '#475569' }}>{product.description || 'Descrição não informada.'}</p>
                                            {product.features && (
                                                <ul style={{ margin: '0 0 12px', paddingLeft: 20, color: '#475569' }}>
                                                    {product.features.split(',').map((item, index) => (
                                                        <li key={index}>{item.trim()}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                                <span style={{ color: '#64748b' }}>Quantidade: {product.quantity}</span>
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
