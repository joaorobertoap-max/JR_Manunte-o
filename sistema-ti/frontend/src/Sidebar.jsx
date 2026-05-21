import { Link, useLocation } from 'react-router-dom'

import './Sidebar.css'

export default function Sidebar() {

    const location = useLocation()

    return (

        <div className="sidebar">

            <h2 className="logo">
                JR SistemaTI
            </h2>

            <Link to="/">

                <div className={
                    location.pathname === '/'
                        ? 'menu-item active'
                        : 'menu-item'
                }>

                    <span className="icon">🏠</span>

                    <span>Empresa</span>

                </div>

            </Link>

            <Link to="/produtos">

                <div className={
                    location.pathname === '/produtos'
                        ? 'menu-item active'
                        : 'menu-item'
                }>

                    <span className="icon">🛍️</span>

                    <span>Produtos</span>

                </div>

            </Link>

            <Link to="/usuarios">

                <div className={
                    location.pathname === '/usuarios'
                        ? 'menu-item active'
                        : 'menu-item'
                }>

                    <span className="icon">👥</span>

                    <span>Usuários</span>

                </div>

            </Link>

            <Link to="/ordens">

                <div className={
                    location.pathname === '/ordens'
                        ? 'menu-item active'
                        : 'menu-item'
                }>

                    <span className="icon">🛠️</span>

                    <span>Ordens</span>

                </div>

            </Link>

            <Link to="/estoque">

                <div className={
                    location.pathname === '/estoque'
                        ? 'menu-item active'
                        : 'menu-item'
                }>

                    <span className="icon">📦</span>

                    <span>Estoque</span>

                </div>

            </Link>

            <Link to="/dispositivos">

                <div className={
                    location.pathname === '/dispositivos'
                        ? 'menu-item active'
                        : 'menu-item'
                }>

                    <span className="icon">💻</span>

                    <span>Dispositivos</span>

                </div>

            </Link>

            <Link to="/financeiro">

                <div className={
                    location.pathname === '/financeiro'
                        ? 'menu-item active'
                        : 'menu-item'
                }>

                    <span className="icon">💰</span>

                    <span>Financeiro</span>

                </div>

            </Link>

        </div>

    )
}