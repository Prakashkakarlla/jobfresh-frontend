import { Link } from 'react-router-dom'

function PrivacyPage() {
    return (
        <div className="privacy-page">
            <section className="hero" style={{ padding: '3rem 0' }}>
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p>Last updated: December 2024</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div className="job-details-card" style={{ lineHeight: '1.8' }}>
                        <h2>1. Introduction</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            JobFresh ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your information when you visit our
                            website www.jobfresh.in.
                        </p>

                        <h2>2. Information We Collect</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            We may collect the following types of information:
                        </p>
                        <ul style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                            <li><strong>Personal Information:</strong> Name, email address, and contact details when you register or apply for jobs</li>
                            <li><strong>Usage Data:</strong> Pages visited, time spent on pages, browser type, and IP address</li>
                            <li><strong>Cookies:</strong> Small data files stored on your device to improve user experience</li>
                        </ul>

                        <h2>3. How We Use Your Information</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            We use the collected information to:
                        </p>
                        <ul style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                            <li>Provide and maintain our service</li>
                            <li>Connect job seekers with potential employers</li>
                            <li>Send job alerts and notifications (with your consent)</li>
                            <li>Improve our website and user experience</li>
                            <li>Analyze usage patterns and trends</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                        <h2>4. Information Sharing</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                            <li>Employers when you apply for a job</li>
                            <li>Service providers who assist in operating our website</li>
                            <li>Legal authorities when required by law</li>
                        </ul>

                        <h2>5. Cookies and Tracking</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            We use cookies and similar tracking technologies to improve your browsing experience
                            and analyze website traffic. You can control cookie settings through your browser preferences.
                        </p>

                        <h2>6. Third-Party Services</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Our website may contain links to third-party websites. We are not responsible for the
                            privacy practices of these external sites. We encourage you to read their privacy policies.
                        </p>

                        <h2>7. Data Security</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            We implement appropriate security measures to protect your personal information. However,
                            no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>

                        <h2>8. Your Rights</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            You have the right to:
                        </p>
                        <ul style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>

                        <h2>9. Children's Privacy</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Our service is not intended for individuals under the age of 18. We do not knowingly
                            collect personal information from children.
                        </p>

                        <h2>10. Changes to This Policy</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            We may update this Privacy Policy from time to time. Changes will be posted on this page
                            with an updated revision date.
                        </p>

                        <h2>11. Contact Us</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPage
