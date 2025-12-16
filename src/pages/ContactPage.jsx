import { Link } from 'react-router-dom'

function ContactPage() {
    return (
        <div className="contact-page">
            <section className="hero" style={{ padding: '3rem 0' }}>
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>Get in touch with the JobFresh team</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="job-details-card">
                        <h2 style={{ marginBottom: '1.5rem' }}>We'd Love to Hear From You</h2>

                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.8' }}>
                            Have questions, feedback, or suggestions? We're here to help!
                            Reach out to us and we'll get back to you as soon as possible.
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>📧 Email Us</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                For all inquiries, please email us at:<br />
                                <a href="mailto:jobfresh@jobfresh.in" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                                    jobfresh@jobfresh.in
                                </a>
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>💼 For Employers</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                Want to post a job on JobFresh? Contact us to learn about our job posting options
                                and reach thousands of qualified tech professionals in India.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🐛 Report an Issue</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                Found a bug or technical issue? Please email us with details about the problem
                                and we'll work to fix it promptly.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>📍 Location</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                India
                            </p>
                        </div>

                        <div style={{
                            borderTop: '1px solid var(--border)',
                            paddingTop: '2rem',
                            marginTop: '2rem'
                        }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Legal</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link to="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>
                                <Link to="/terms" style={{ color: 'var(--primary)' }}>Terms of Service</Link>
                                <Link to="/disclaimer" style={{ color: 'var(--primary)' }}>Disclaimer</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ContactPage
