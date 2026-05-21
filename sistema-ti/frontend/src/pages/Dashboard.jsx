import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { removeToken } from '../lib/api'

export default function Dashboard({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const sidebarItems = [
    { icon: '🏠', label: 'Dashboard' },
    { icon: '�️', label: 'Produtos' },
    { icon: '👥', label: 'Usuários' },
    { icon: '🛠️', label: 'Ordens' },
    { icon: '📦', label: 'Estoque' },
    { icon: '💻', label: 'Dispositivos' },
    { icon: '💰', label: 'Financeiro' }
  ]

  // Map labels to routes (adjust routes as your app defines them)
  const routeMap = {
    Dashboard: '/',
    Produtos: '/produtos',
    Usuários: '/users',
    Ordens: '/orders',
    Estoque: '/stock',
    Dispositivos: '/devices',
    Financeiro: '/financial'
  }

  function handleSidebarClick(item) {
    const path = routeMap[item.label]
    if (path) {
      navigate(path)
    } else {
      console.log('Clicar em:', item.label)
    }
  }

  const activeItem = React.useMemo(() => {
    const match = sidebarItems.find((item) => routeMap[item.label] === location.pathname)
    return match ? match.label : 'Dashboard'
  }, [location.pathname])

  function handleSettingsClick() {
    // placeholder: open settings panel/modal
    console.log('Abrir configurações')
  }

  const metrics = [
    {
      label: 'Ordens em aberto',
      value: '42',
      subtitle: 'Atendimentos pendentes',
      progress: 68
    },
    {
      label: 'Peças vendidas',
      value: '128',
      subtitle: 'Reposições realizadas',
      progress: 82
    }
  ]

  const stockItems = [
    { title: 'Memória RAM', count: 24, color: '#fb923c' },
    { title: 'HD/SSD', count: 18, color: '#2e75f8' },
    { title: 'Baterias', count: 36, color: '#df3822' },
    { title: 'Fontes', count: 14, color: '#22c55e' }
  ]

  const activeUsers = ['Admin', 'Técnico', 'Cliente', 'Fornecedor']

  const workflow = [
    { label: 'Entrada com problema', icon: '📥' },
    { label: 'Reparo em andamento', icon: '🔧' },
    { label: 'Entrega', icon: '🚚' },
    { label: 'Reposição', icon: '♻️' }
  ]

  const shortcuts = [
    { icon: '➕', label: 'Nova ordem' },
    { icon: '👤', label: 'Cadastrar usuário' },
    { icon: '📦', label: 'Cadastrar peça' },
    { icon: '📊', label: 'Relatório' }
  ]

  return (
    <div className="dashboard-app">
      <aside className="dashboard-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <img src="/logo.png" alt="JR Manutenção" />
          </div>
          <div className="sidebar-title">
            <span>Sistema</span>
            <strong>TI</strong>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`sidebar-icon ${activeItem === item.label ? 'active' : ''}`}
              title={item.label}
              onClick={() => handleSidebarClick(item)}
              aria-pressed={activeItem === item.label}
            >
              <span className="sidebar-icon-symbol">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar-settings" title="Configurações" onClick={handleSettingsClick}>
          ⚙️
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <p className="topbar-small">Seja Bem Vindo</p>
            <h1>JR Manutenção</h1>
          </div>
          <div className="topbar-right">
            <button className="topbar-icon">🔍</button>
            <button className="topbar-icon">🔔</button>
            <button className="topbar-icon" onClick={() => { removeToken(); navigate('/login') }}>⏏️</button>
            <div className="topbar-clock">07:30</div>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="main-panel">
            {children ? (
              children
            ) : (
              <>
                <div className="status-cards">
                  {metrics.map((item) => (
                    <article className="status-card" key={item.label}>
                      <div className="status-card-head">
                        <p>{item.label}</p>
                        <span>{item.subtitle}</span>
                      </div>
                      <h2>{item.value}</h2>
                      <div className="progress-bar">
                        <span style={{ width: `${item.progress}%` }} />
                      </div>
                    </article>
                  ))}
                </div>

                <div className="graph-card">
                  <div className="card-header">
                    <div>
                      <p>Consumo</p>
                      <h2>Rastreamento de peças</h2>
                    </div>
                    <div className="graph-legend">
                      <span className="legend-dot orange" /> Estoque
                    </div>
                  </div>
                  <div className="graph-placeholder">
                    <div className="graph-line blue" />
                    <div className="graph-line purple" />
                    <div className="graph-line orange" />
                  </div>
                </div>

                <div className="workflow-card">
                  <div className="card-header">
                    <div>
                      <p>Processo</p>
                      <h2>Entrada, reparo e entrega</h2>
                    </div>
                    <button className="text-button">Ver tudo</button>
                  </div>
                  <div className="workflow-grid">
                    {workflow.map((item) => (
                      <div className="workflow-item" key={item.label}>
                        <span>{item.icon}</span>
                        <p>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>

          <aside className="sidebar-panel">
            <div className="panel-card home-panel">
              <div className="panel-header">
                <p>Usuários ativos</p>
                <span className="badge">Online</span>
              </div>
              <div className="users-row">
                {activeUsers.map((user) => (
                  <div className="user-chip" key={user}>
                    <span>{user[0]}</span>
                    <strong>{user}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-card devices-panel">
              <div className="panel-header">
                <p>Estoque de peças</p>
              </div>
              <div className="device-grid">
                {stockItems.map((device) => (
                  <div className="device-card" key={device.title} style={{ background: device.color }}>
                    <span>{device.title}</span>
                    <strong>{device.count}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-card shortcuts-panel">
              <div className="panel-header">
                <p>Ações rápidas</p>
              </div>
              <div className="shortcuts-grid">
                {shortcuts.map((item) => (
                  <button className="shortcut-button" key={item.label}>
                    <span>{item.icon}</span>
                    <strong>{item.label}</strong>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
