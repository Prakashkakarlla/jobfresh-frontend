import { Link } from 'react-router-dom'

function DisclaimerPage() {
    return (
        <div className="disclaimer-page">
            <section className="hero" style={{ padding: '3rem 0' }}>
                <div className="container">
                    <h1>Disclaimer</h1>
                    <p>Important information about using JobFresh</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="job-details-card">
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Last updated: December 2024
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>1. General Information</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                The information provided on JobFresh (www.jobfresh.in) is for general informational
                                purposes only. All job listings, company information, and other content on this
                                website are provided in good faith, however, we make no representation or warranty
                                of any kind, express or implied, regarding the accuracy, adequacy, validity,
                                reliability, availability, or completeness of any information on the website.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>2. Job Listings</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                JobFresh aggregates and displays job postings from various sources. We do not
                                guarantee the accuracy, completeness, or timeliness of job listings. Job seekers
                                should verify all job details directly with the hiring company before applying.
                                We are not responsible for the hiring decisions of any company or the outcome
                                of any job application.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>3. External Links</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                The website may contain links to external websites that are not provided or
                                maintained by or in any way affiliated with JobFresh. Please note that we do
                                not guarantee the accuracy, relevance, timeliness, or completeness of any
                                information on these external websites.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>4. Professional Advice</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                The content on JobFresh, including career guides and blog posts, is not intended
                                to be a substitute for professional career advice, legal advice, or other
                                professional services. Always seek the advice of a qualified professional with
                                any questions you may have regarding your career or employment matters.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>5. No Employment Guarantee</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                JobFresh does not guarantee employment or job placement. We serve as a platform
                                to connect job seekers with potential employers, but the final hiring decision
                                rests solely with the respective companies.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>6. Limitation of Liability</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                Under no circumstances shall JobFresh be liable for any direct, indirect,
                                incidental, special, consequential, or punitive damages, including but not
                                limited to loss of profits, data, use, goodwill, or other intangible losses,
                                resulting from your access to or use of or inability to access or use the website.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>7. Accuracy of Information</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                While we strive to keep information up to date and correct, salary ranges,
                                job requirements, and company details may change without notice. Users should
                                always verify details with the hiring company before making any decisions.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>8. Changes to This Disclaimer</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                We may update this disclaimer from time to time. Any changes will be posted on
                                this page with an updated revision date. We encourage users to review this page
                                periodically to stay informed about our disclaimer.
                            </p>
                        </div>

                        <div style={{
                            borderTop: '1px solid var(--border)',
                            paddingTop: '2rem',
                            marginTop: '2rem'
                        }}>
                            <h2 style={{ marginBottom: '1rem' }}>Contact Us</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                If you have any questions about this Disclaimer, please contact us at{' '}
                                <a href="mailto:jobfresh@jobfresh.in" style={{ color: 'var(--primary)' }}>
                                    jobfresh@jobfresh.in
                                </a>
                            </p>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link to="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>
                                <Link to="/terms" style={{ color: 'var(--primary)' }}>Terms of Service</Link>
                                <Link to="/contact" style={{ color: 'var(--primary)' }}>Contact Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DisclaimerPage
