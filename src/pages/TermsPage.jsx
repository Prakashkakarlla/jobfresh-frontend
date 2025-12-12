import { Link } from 'react-router-dom'

function TermsPage() {
    return (
        <div className="terms-page">
            <section className="hero" style={{ padding: '3rem 0' }}>
                <div className="container">
                    <h1>Terms of Service</h1>
                    <p>Last updated: December 2024</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div className="job-details-card" style={{ lineHeight: '1.8' }}>
                        <h2>1. Acceptance of Terms</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            By accessing and using JobFresh (www.jobfresh.in), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service.
                        </p>

                        <h2>2. Description of Service</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            JobFresh is an online job portal that connects job seekers with employers. We provide job listings,
                            career resources, and related services to help users find employment opportunities in the technology sector.
                        </p>

                        <h2>3. User Responsibilities</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Users are responsible for:
                        </p>
                        <ul style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                            <li>Providing accurate and truthful information</li>
                            <li>Maintaining the confidentiality of their account</li>
                            <li>Not engaging in any fraudulent or illegal activities</li>
                            <li>Respecting intellectual property rights</li>
                            <li>Not posting false or misleading job listings</li>
                        </ul>

                        <h2>4. Job Listings</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            JobFresh strives to provide accurate job listings. However, we do not guarantee the accuracy,
                            completeness, or availability of any job posting. We are not responsible for hiring decisions
                            made by employers or the outcome of any job application.
                        </p>

                        <h2>5. Intellectual Property</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            All content on JobFresh, including text, graphics, logos, and software, is the property of
                            JobFresh and is protected by copyright and trademark laws. Users may not reproduce, distribute,
                            or create derivative works without our express written permission.
                        </p>

                        <h2>6. Limitation of Liability</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            JobFresh is provided "as is" without warranties of any kind. We are not liable for any direct,
                            indirect, incidental, or consequential damages arising from the use of our service.
                        </p>

                        <h2>7. Privacy</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Your privacy is important to us. Please review our <Link to="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link> to
                            understand how we collect, use, and protect your personal information.
                        </p>

                        <h2>8. Modifications</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            We reserve the right to modify these Terms of Service at any time. Changes will be effective
                            immediately upon posting. Continued use of JobFresh after changes constitutes acceptance of the new terms.
                        </p>

                        <h2>9. Termination</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            We may terminate or suspend access to our service immediately, without prior notice, for any
                            breach of these Terms of Service.
                        </p>

                        <h2>10. Contact</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            For questions about these Terms of Service, please contact us at:
                            <a href="mailto:jobfresh@jobfresh.in" style={{ color: 'var(--primary)', marginLeft: '0.5rem' }}>
                                jobfresh@jobfresh.in
                            </a>
                        </p>

                        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <Link to="/about" style={{ color: 'var(--primary)', textDecoration: 'none' }}>← Back to About</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TermsPage
