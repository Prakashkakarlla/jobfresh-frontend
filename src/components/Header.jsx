import { Link, useLocation } from 'react-router-dom'

function Header() {
    const location = useLocation()

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <span className="logo-text">JobFresh</span>
                </Link>
                <nav className="nav">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Jobs
                    </Link>
                    <Link
                        to="/blog"
                        className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}
                    >
                        Blog
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                    >
                        About
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header
