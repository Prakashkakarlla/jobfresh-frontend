import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>JobFresh</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                            India's premier job portal for tech professionals
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3>For Job Seekers</h3>
                        <Link to="/">Browse Jobs</Link>
                        <Link to="/blog">Career Guide</Link>
                        <Link to="/about">About Us</Link>
                    </div>
                    <div className="footer-section">
                        <h3>Resources</h3>
                        <Link to="/blog">Blog</Link>
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                    </div>
                    <div className="footer-section">
                        <h3>Contact</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Email: info@jobfresh.com<br />
                            Phone: +91-80-1234-5678
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 JobFresh. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
