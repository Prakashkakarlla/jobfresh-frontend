import { Link } from 'react-router-dom'

function AboutPage() {
    return (
        <div className="about-page">
            <section className="hero" style={{ padding: '3rem 0' }}>
                <div className="container">
                    <h1>About JobFresh</h1>
                    <p>India's premier job portal for tech professionals</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div className="job-details-card">
                        <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            JobFresh is dedicated to making job searching easier, faster, and more transparent for tech professionals in India.
                            We connect talented individuals with opportunities at top companies, helping them find their dream careers.
                        </p>

                        <h2 style={{ marginBottom: '1rem' }}>What We Offer</h2>
                        <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2rem', paddingLeft: '1.5rem' }}>
                            <li>Curated job listings from verified companies</li>
                            <li>Detailed company profiles and insights</li>
                            <li>Career guidance and interview tips</li>
                            <li>Transparent salary information</li>
                            <li>Easy application process</li>
                            <li>Regular updates on new opportunities</li>
                        </ul>

                        <h2 style={{ marginBottom: '1rem' }}>Why Choose JobFresh?</h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                            <strong>Quality over Quantity:</strong> We focus on genuine opportunities from reputable companies.
                            <br /><br />
                            <strong>Detailed Information:</strong> Complete job descriptions with salary ranges and requirements.
                            <br /><br />
                            <strong>Easy Application:</strong> Apply directly without complicated forms.
                            <br /><br />
                            <strong>Free for Job Seekers:</strong> All features are completely free for candidates.
                        </p>

                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Contact Us</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Email: <a href="mailto:jobfresh@jobfresh.in" style={{ color: 'var(--primary)' }}>jobfresh@jobfresh.in</a><br />
                                Location: India
                            </p>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link to="/terms" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Terms of Service</Link>
                            <span style={{ color: 'var(--text-secondary)' }}>|</span>
                            <Link to="/privacy" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage
