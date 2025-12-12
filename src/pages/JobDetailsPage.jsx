import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function JobDetailsPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [company, setCompany] = useState(null)
    const [category, setCategory] = useState(null)
    const [relatedJobs, setRelatedJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchJobDetails()
    }, [slug])

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`https://api.jobfresh.in/api/jobs/${slug}`)
            setJob(response.data)
            setLoading(false)

            console.log('Job data:', response.data)

            // Detail API returns company and category as objects with slug field
            const companySlug = response.data.company?.slug
            const categorySlug = response.data.category?.slug

            console.log('Company slug:', companySlug, 'Category slug:', categorySlug)

            // Fetch full company and category details
            if (companySlug) {
                fetchCompanyDetails(companySlug)
            }
            if (categorySlug) {
                fetchCategoryDetails(categorySlug)
            }

            // Fetch related jobs
            if (categorySlug || response.data.company?.name) {
                fetchRelatedJobs(response.data.id, categorySlug, response.data.company?.name)
            }
        } catch (error) {
            console.error('Error fetching job details:', error)
            setLoading(false)
        }
    }

    const fetchCompanyDetails = async (companySlug) => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/companies/all')
            const foundCompany = response.data.find(c => c.slug === companySlug)
            if (foundCompany) {
                console.log('Found company:', foundCompany)
                setCompany(foundCompany)
            } else {
                console.log('Company not found for slug:', companySlug)
            }
        } catch (error) {
            console.error('Error fetching company details:', error)
        }
    }

    const fetchCategoryDetails = async (categorySlug) => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/categories/all')
            const foundCategory = response.data.find(c => c.slug === categorySlug)
            if (foundCategory) {
                console.log('Found category:', foundCategory)
                setCategory(foundCategory)
            } else {
                console.log('Category not found for slug:', categorySlug)
            }
        } catch (error) {
            console.error('Error fetching category details:', error)
        }
    }

    const fetchRelatedJobs = async (currentJobId, categorySlug, companyName) => {
        try {
            console.log('Fetching related jobs for:', { currentJobId, categorySlug, companyName })
            const response = await axios.get('https://api.jobfresh.in/api/jobs?size=100')
            const allJobs = response.data.content
            console.log('Total jobs fetched:', allJobs.length)

            // Filter to get related jobs (same category or same company, exclude current job)
            const related = allJobs
                .filter(j => j.id !== currentJobId) // Exclude current job
                .filter(j => j.categorySlug === categorySlug || j.companyName === companyName) // Same category or company
                .slice(0, 4) // Limit to 4 related jobs

            console.log('Related jobs found:', related.length, related)
            setRelatedJobs(related)
        } catch (error) {
            console.error('Error fetching related jobs:', error)
        }
    }

    const formatSalary = (min, max) => {
        const formatLPA = (amount) => {
            return `₹${(amount / 100000).toFixed(0)} LPA`
        }
        return `${formatLPA(min)} - ${formatLPA(max)}`
    }

    const handleApply = () => {
        if (job.applicationLink) {
            window.open(job.applicationLink, '_blank')
        }
    }

    if (loading) {
        return <div className="loading">Loading job details...</div>
    }

    if (!job) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Job not found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Back to Jobs
                </button>
            </div>
        )
    }

    return (
        <div className="job-details">
            <div className="container">
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginBottom: '1.5rem',
                        padding: '0.5rem 0'
                    }}
                >
                    ← Back to all jobs
                </button>

                {/* Two-column layout: Main content + Sidebar */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: relatedJobs.length > 0 ? '1fr 350px' : '1fr',
                    gap: '2rem'
                }}>
                    {/* Main content */}
                    <div className="job-details-card fade-in">
                        <div style={{ marginBottom: '2rem' }}>
                            <h1>{job.title}</h1>

                            {/* Company info with logo */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                {company?.logoUrl && (
                                    <img
                                        src={company.logoUrl}
                                        alt={job.companyName}
                                        style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                    />
                                )}
                                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    {job.companyName}
                                </p>
                            </div>

                            <div className="job-meta" style={{ marginBottom: '1.5rem' }}>
                                <span className="meta-item">📍 {job.location}</span>
                                <span className="meta-item">💼 {job.jobType}</span>
                                <span className="meta-item">🏢 {job.workMode}</span>
                                {job.remote && <span className="badge badge-success">Remote Available</span>}
                            </div>

                            {/* Salary from compensation object or direct fields */}
                            {(job.compensation?.salaryMin || job.salaryMin) && (
                                <div className="salary" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--primary)' }}>
                                    💰 {formatSalary(
                                        job.compensation?.salaryMin || job.salaryMin,
                                        job.compensation?.salaryMax || job.salaryMax
                                    )}
                                </div>
                            )}

                            <button
                                className="btn btn-primary"
                                onClick={handleApply}
                                style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}
                            >
                                Apply Now
                            </button>
                        </div>

                        {/* Company Information Section */}
                        {company && company.about && (
                            <div className="job-section" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <h2>About {company.name}</h2>
                                <p>{company.about}</p>
                                {company.website && (
                                    <p style={{ marginTop: '1rem' }}>
                                        <strong>Website:</strong>{' '}
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                                            {company.website}
                                        </a>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Category Information Section */}
                        {category && (
                            <>
                                {category.introText && (
                                    <div className="job-section">
                                        <h2>About {category.name} Jobs</h2>
                                        <p>{category.introText}</p>
                                    </div>
                                )}

                                {category.careerGuide && (
                                    <div className="job-section">
                                        <h2>Career Guide: {category.name}</h2>
                                        <p style={{ whiteSpace: 'pre-line' }}>{category.careerGuide}</p>
                                    </div>
                                )}

                                {category.faq && (
                                    <div className="job-section">
                                        <h2>Frequently Asked Questions</h2>
                                        <p style={{ whiteSpace: 'pre-line' }}>{category.faq}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {job.roleSummary && (
                            <div className="job-section">
                                <h2>About the Role</h2>
                                <p>{job.roleSummary}</p>
                            </div>
                        )}

                        {job.responsibilities && (
                            <div className="job-section">
                                <h2>Responsibilities</h2>
                                <ul>
                                    {job.responsibilities.split('\n').map((resp, index) => (
                                        <li key={index}>{resp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.mustHaveSkills && (
                            <div className="job-section">
                                <h2>Required Skills</h2>
                                <p>{job.mustHaveSkills}</p>
                            </div>
                        )}

                        {job.niceToHaveSkills && (
                            <div className="job-section">
                                <h2>Nice to Have</h2>
                                <p>{job.niceToHaveSkills}</p>
                            </div>
                        )}

                        {job.benefitsSummary && (
                            <div className="job-section">
                                <h2>Benefits</h2>
                                <p>{job.benefitsSummary}</p>
                            </div>
                        )}

                        {(job.eligibleBatch || job.qualification || job.experienceLevel || job.lastDateToApply) && (
                            <div className="job-section">
                                <h2>Eligibility Information</h2>
                                {job.eligibleBatch && <p><strong>Eligible Batch:</strong> {job.eligibleBatch}</p>}
                                {job.qualification && <p><strong>Qualification:</strong> {job.qualification}</p>}
                                {job.experienceLevel && <p><strong>Experience:</strong> {job.experienceLevel}</p>}
                                {job.lastDateToApply && <p><strong>Last Date to Apply:</strong> {new Date(job.lastDateToApply).toLocaleDateString()}</p>}
                            </div>
                        )}

                        {job.eligibilityCriteria && (
                            <div className="job-section">
                                <h2>Eligibility Criteria</h2>
                                <ul>
                                    {job.eligibilityCriteria.split('\n').filter(c => c.trim()).map((criteria, index) => (
                                        <li key={index}>{criteria}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.selectionProcess && (
                            <div className="job-section">
                                <h2>Selection Process</h2>
                                <ul>
                                    {job.selectionProcess.split('\n').filter(s => s.trim()).map((stage, index) => (
                                        <li key={index}>{stage}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.interviewTips && (
                            <div className="job-section">
                                <h2>Interview Tips</h2>
                                <ul>
                                    {job.interviewTips.split('\n').filter(t => t.trim()).map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.careerGrowthInfo && (
                            <div className="job-section">
                                <h2>Career Growth</h2>
                                <p>{job.careerGrowthInfo}</p>
                                {job.futureRoles && (
                                    <p style={{ marginTop: '1rem' }}>
                                        <strong>Possible Future Roles:</strong> {job.futureRoles}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="job-section">
                            <h2>How to Apply</h2>
                            <p>Click the "Apply Now" button above to be redirected to the company's application page.</p>
                            <button
                                className="btn btn-primary"
                                onClick={handleApply}
                                style={{ marginTop: '1rem' }}
                            >
                                Apply for this position
                            </button>
                        </div>
                    </div>
                    {/* End main content */}

                    {/* Related Jobs Sidebar */}
                    {relatedJobs.length > 0 && (
                        <div className="related-jobs-sidebar">
                            <div style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <h3 style={{
                                    marginBottom: '1.5rem',
                                    fontSize: '1.25rem',
                                    fontWeight: '600'
                                }}>
                                    Related Jobs
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}>
                                    {relatedJobs.map(relatedJob => (
                                        <div
                                            key={relatedJob.id}
                                            onClick={() => {
                                                window.scrollTo(0, 0)
                                                navigate(`/jobs/${relatedJob.slug}`)
                                            }}
                                            style={{
                                                padding: '1rem',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                background: '#f9fafb'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'white'
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                                                e.currentTarget.style.borderColor = 'var(--primary)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#f9fafb'
                                                e.currentTarget.style.boxShadow = 'none'
                                                e.currentTarget.style.borderColor = '#e5e7eb'
                                            }}
                                        >
                                            <h4 style={{
                                                fontSize: '0.95rem',
                                                marginBottom: '0.5rem',
                                                fontWeight: '600',
                                                lineHeight: '1.3'
                                            }}>
                                                {relatedJob.title}
                                            </h4>
                                            <p style={{
                                                fontSize: '0.85rem',
                                                color: 'var(--text-secondary)',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {relatedJob.companyName}
                                            </p>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-secondary)',
                                                marginBottom: '0.5rem'
                                            }}>
                                                📍 {relatedJob.location}
                                            </div>
                                            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                                                {relatedJob.categoryName}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* End grid container */}

                {/* Explore More Section */}
                <section style={{ padding: '3rem 0', marginTop: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <div className="container">
                        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Explore More Opportunities</h2>

                        {/* Job Categories */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                Browse by Category
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                justifyContent: 'center'
                            }}>
                                <button onClick={() => navigate('/?category=software-development')} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    💼 Software Development
                                </button>
                                <button onClick={() => navigate('/?category=data-science')} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    📊 Data Science
                                </button>
                                <button onClick={() => navigate('/?category=design')} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    🎨 Design
                                </button>
                                <button onClick={() => navigate('/?category=product-management')} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    📈 Product Management
                                </button>
                                <button onClick={() => navigate('/?category=devops')} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    🔧 DevOps
                                </button>
                            </div>
                        </div>

                        {/* Blog Resources */}
                        <div>
                            <h3 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                Career Resources
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                justifyContent: 'center'
                            }}>
                                <button onClick={() => navigate('/blog')} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    📚 All Articles
                                </button>
                                <button onClick={() => navigate('/blog')} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    💡 Career Tips
                                </button>
                                <button onClick={() => navigate('/blog')} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    🎯 Interview Prep
                                </button>
                                <button onClick={() => navigate('/blog')} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    📝 Resume Tips
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default JobDetailsPage
