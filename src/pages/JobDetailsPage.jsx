import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SkeletonJobDetails } from '../components/Skeleton'

function JobDetailsPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [company, setCompany] = useState(null)
    const [category, setCategory] = useState(null)
    const [relatedJobs, setRelatedJobs] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchJobDetails()
        fetchAllCategories()
    }, [slug])

    const fetchAllCategories = async () => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/categories/all')
            setAllCategories(response.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`https://api.jobfresh.in/api/jobs/${slug}`)
            setJob(response.data)
            setLoading(false)

            const companySlug = response.data.company?.slug
            const categorySlug = response.data.category?.slug

            if (companySlug) fetchCompanyDetails(companySlug)
            if (categorySlug) fetchCategoryDetails(categorySlug)
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
            if (foundCompany) setCompany(foundCompany)
        } catch (error) {
            console.error('Error fetching company details:', error)
        }
    }

    const fetchCategoryDetails = async (categorySlug) => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/categories/all')
            const foundCategory = response.data.find(c => c.slug === categorySlug)
            if (foundCategory) setCategory(foundCategory)
        } catch (error) {
            console.error('Error fetching category details:', error)
        }
    }

    const fetchRelatedJobs = async (currentJobId, categorySlug, companyName) => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/jobs?size=100')
            const allJobs = response.data.content
            const related = allJobs
                .filter(j => j.id !== currentJobId)
                .filter(j => j.categorySlug === categorySlug || j.companyName === companyName)
                .slice(0, 4)
            setRelatedJobs(related)
        } catch (error) {
            console.error('Error fetching related jobs:', error)
        }
    }

    const formatSalary = (min, max) => {
        const formatLPA = (amount) => `₹${(amount / 100000).toFixed(0)} LPA`
        return `${formatLPA(min)} - ${formatLPA(max)}`
    }

    const handleApply = () => {
        if (job.applicationLink) window.open(job.applicationLink, '_blank')
    }

    const getCompanyLogoUrl = () => {
        if (company?.logoUrl) return company.logoUrl
        const name = job?.company?.name || job?.companyName || 'Company'
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a2e&color=00d4aa&size=200&bold=true&format=svg`
    }

    if (loading) {
        return (
            <div className="jd-page">
                <div className="container">
                    <SkeletonJobDetails />
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="jd-page">
                <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                    <h2>Job not found</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>This job may have been removed or the link is incorrect.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Browse All Jobs
                    </button>
                </div>
            </div>
        )
    }

    const companyName = job.company?.name || job.companyName || ''
    const postedDate = job.postedAt ? new Date(job.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null

    return (
        <div className="jd-page">
            {/* Hero Banner with Company Logo */}
            <div className="jd-hero">
                <div className="jd-hero-bg">
                    <img
                        src={getCompanyLogoUrl()}
                        alt={companyName}
                        className="jd-hero-logo"
                        onError={(e) => {
                            const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=1a1a2e&color=00d4aa&size=200&bold=true&format=svg`
                            if (e.target.src !== fallback) e.target.src = fallback
                        }}
                    />
                </div>
                <div className="jd-hero-overlay"></div>
            </div>

            <div className="container">
                {/* Back button */}
                <button onClick={() => navigate('/')} className="jd-back-btn">
                    ← Back to all jobs
                </button>

                {/* Job Title Card */}
                <div className="jd-title-card fade-in">
                    <div className="jd-title-top">
                        <h1 className="jd-title">{job.title}</h1>
                        <p className="jd-company">{companyName}</p>
                    </div>

                    <div className="jd-quick-info">
                        <span className="jd-info-chip">📍 {job.location}</span>
                        <span className="jd-info-chip">💼 {job.jobType}</span>
                        {job.workMode && <span className="jd-info-chip">🏢 {job.workMode}</span>}
                        {job.remote && <span className="jd-info-chip jd-chip-highlight">🌐 Remote</span>}
                        {postedDate && <span className="jd-info-chip">📅 {postedDate}</span>}
                    </div>

                    {(job.compensation?.salaryMin || job.salaryMin) && (
                        <div className="jd-salary">
                            💰 {formatSalary(
                                job.compensation?.salaryMin || job.salaryMin,
                                job.compensation?.salaryMax || job.salaryMax
                            )}
                        </div>
                    )}

                    <div className="jd-badges">
                        <span className="badge badge-primary">{job.category?.name || job.categoryName}</span>
                        {job.experienceLevel && <span className="badge badge-secondary">{job.experienceLevel}</span>}
                        {job.eligibleBatch && <span className="badge badge-secondary">Batch: {job.eligibleBatch}</span>}
                    </div>
                </div>

                {/* Content Sections */}
                <div className="jd-content fade-in">

                    {/* About the Role */}
                    {job.roleSummary && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">📋 About the Role</h2>
                            <p className="jd-section-text">{job.roleSummary}</p>
                        </div>
                    )}

                    {/* Responsibilities */}
                    {job.responsibilities && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">🎯 Responsibilities</h2>
                            <ul className="jd-list">
                                {job.responsibilities.split('\n').filter(r => r.trim()).map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Required Skills */}
                    {job.mustHaveSkills && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">⚡ Required Skills</h2>
                            <p className="jd-section-text">{job.mustHaveSkills}</p>
                        </div>
                    )}

                    {/* Nice to Have */}
                    {job.niceToHaveSkills && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">✨ Nice to Have</h2>
                            <p className="jd-section-text">{job.niceToHaveSkills}</p>
                        </div>
                    )}

                    {/* Eligibility */}
                    {(job.qualification || job.lastDateToApply) && (
                        <div className="jd-section jd-section-highlight">
                            <h2 className="jd-section-title">🎓 Eligibility</h2>
                            <div className="jd-info-grid">
                                {job.qualification && (
                                    <div className="jd-info-item">
                                        <span className="jd-info-label">Qualification</span>
                                        <span className="jd-info-value">{job.qualification}</span>
                                    </div>
                                )}
                                {job.experienceLevel && (
                                    <div className="jd-info-item">
                                        <span className="jd-info-label">Experience</span>
                                        <span className="jd-info-value">{job.experienceLevel}</span>
                                    </div>
                                )}
                                {job.eligibleBatch && (
                                    <div className="jd-info-item">
                                        <span className="jd-info-label">Eligible Batch</span>
                                        <span className="jd-info-value">{job.eligibleBatch}</span>
                                    </div>
                                )}
                                {job.lastDateToApply && (
                                    <div className="jd-info-item">
                                        <span className="jd-info-label">Last Date</span>
                                        <span className="jd-info-value jd-deadline">{new Date(job.lastDateToApply).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Eligibility Criteria */}
                    {job.eligibilityCriteria && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">📝 Eligibility Criteria</h2>
                            <ul className="jd-list">
                                {job.eligibilityCriteria.split('\n').filter(c => c.trim()).map((criteria, i) => (
                                    <li key={i}>{criteria}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Selection Process */}
                    {job.selectionProcess && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">🔄 Selection Process</h2>
                            <div className="jd-steps">
                                {job.selectionProcess.split('\n').filter(s => s.trim()).map((stage, i) => (
                                    <div className="jd-step" key={i}>
                                        <div className="jd-step-num">{i + 1}</div>
                                        <span>{stage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interview Tips */}
                    {job.interviewTips && (
                        <div className="jd-section jd-section-highlight">
                            <h2 className="jd-section-title">💡 Interview Tips</h2>
                            <ul className="jd-list jd-tips">
                                {job.interviewTips.split('\n').filter(t => t.trim()).map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Benefits */}
                    {job.compensation?.benefitsSummary && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">🎁 Benefits & Perks</h2>
                            <p className="jd-section-text">{job.compensation.benefitsSummary}</p>
                            {job.compensation.additionalPerks && (
                                <p className="jd-section-text" style={{ marginTop: '0.75rem' }}>{job.compensation.additionalPerks}</p>
                            )}
                        </div>
                    )}

                    {/* Career Growth */}
                    {job.careerGrowthInfo && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">📈 Career Growth</h2>
                            <p className="jd-section-text">{job.careerGrowthInfo}</p>
                            {job.futureRoles && (
                                <p className="jd-section-text" style={{ marginTop: '0.75rem' }}>
                                    <strong>Possible Future Roles:</strong> {job.futureRoles}
                                </p>
                            )}
                        </div>
                    )}

                    {/* About Company */}
                    {company && company.about && (
                        <div className="jd-section jd-company-section">
                            <h2 className="jd-section-title">🏢 About {company.name}</h2>
                            <p className="jd-section-text">{company.about}</p>
                            {company.workCulture && (
                                <>
                                    <h3 className="jd-subsection-title">Work Culture</h3>
                                    <p className="jd-section-text">{company.workCulture}</p>
                                </>
                            )}
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="jd-company-link">
                                    🌐 Visit {company.name} Website →
                                </a>
                            )}
                        </div>
                    )}

                    {/* Category Info */}
                    {category && category.introText && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">📂 About {category.name} Jobs</h2>
                            <p className="jd-section-text">{category.introText}</p>
                        </div>
                    )}

                    {category && category.careerGuide && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">🗺️ Career Guide: {category.name}</h2>
                            <p className="jd-section-text" style={{ whiteSpace: 'pre-line' }}>{category.careerGuide}</p>
                        </div>
                    )}

                    {category && category.faq && (
                        <div className="jd-section">
                            <h2 className="jd-section-title">❓ Frequently Asked Questions</h2>
                            <p className="jd-section-text" style={{ whiteSpace: 'pre-line' }}>{category.faq}</p>
                        </div>
                    )}

                    {/* ===== APPLY BUTTON (ONLY AT BOTTOM) ===== */}
                    <div className="jd-apply-section">
                        <div className="jd-apply-inner">
                            <h2>Ready to Apply?</h2>
                            <p>Don't miss this opportunity at <strong>{companyName}</strong></p>
                            <button className="jd-apply-btn" onClick={handleApply}>
                                🚀 Apply Now
                            </button>
                            <span className="jd-apply-hint">You'll be redirected to the company's application page</span>
                        </div>
                    </div>
                </div>

                {/* Related Jobs */}
                {relatedJobs.length > 0 && (
                    <div className="jd-related fade-in">
                        <h2 className="jd-related-title">Similar Openings</h2>
                        <div className="jd-related-grid">
                            {relatedJobs.map(rj => (
                                <div
                                    key={rj.id}
                                    className="jd-related-card"
                                    onClick={() => {
                                        window.scrollTo(0, 0)
                                        navigate(`/jobs/${rj.slug}`)
                                    }}
                                >
                                    <h4 className="jd-related-card-title">{rj.title}</h4>
                                    <p className="jd-related-card-company">{rj.companyName}</p>
                                    <div className="jd-related-card-meta">
                                        <span>📍 {rj.location}</span>
                                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{rj.categoryName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Explore More Categories */}
                <div className="jd-explore fade-in">
                    <h2>Explore More Opportunities</h2>
                    <div className="jd-explore-pills">
                        {allCategories.map(cat => (
                            <button key={cat.id} onClick={() => navigate(`/?category=${cat.slug}`)} className="category-pill">
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDetailsPage
