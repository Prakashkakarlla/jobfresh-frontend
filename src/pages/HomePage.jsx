import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { SkeletonJobGrid } from '../components/Skeleton'
import { cache, CACHE_KEYS } from '../utils/cache'

function HomePage() {
    const [jobs, setJobs] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const pageSize = 12 // Jobs per page
    const navigate = useNavigate()
    const location = useLocation()

    // Read category from URL query params on load
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const categoryFromUrl = params.get('category')
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl)
        }
    }, [location.search])

    useEffect(() => {
        fetchJobs()
        fetchCategories()
    }, [])

    const fetchJobs = async () => {
        try {
            // Check cache first
            const cachedJobs = cache.get(CACHE_KEYS.JOBS)
            if (cachedJobs) {
                setJobs(cachedJobs)
                setLoading(false)
                return
            }

            setLoading(true)
            const response = await axios.get('https://api.jobfresh.in/api/jobs?size=1000')
            setJobs(response.data.content)
            cache.set(CACHE_KEYS.JOBS, response.data.content) // Cache the results
            setLoading(false)
        } catch (error) {
            console.error('Error fetching jobs:', error)
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            // Check cache first
            const cachedCategories = cache.get(CACHE_KEYS.JOB_CATEGORIES)
            if (cachedCategories) {
                setCategories(cachedCategories)
                return
            }

            const response = await axios.get('https://api.jobfresh.in/api/categories/all')
            setCategories(response.data)
            cache.set(CACHE_KEYS.JOB_CATEGORIES, response.data) // Cache the results
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || job.categorySlug === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Client-side pagination
    const totalFilteredJobs = filteredJobs.length
    const totalPages = Math.ceil(totalFilteredJobs / pageSize)
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

    // Reset to page 0 when filters change
    useEffect(() => {
        setCurrentPage(0)
    }, [searchTerm, selectedCategory])

    const formatSalary = (min, max) => {
        const formatLPA = (amount) => {
            return `₹${(amount / 100000).toFixed(0)} LPA`
        }
        return `${formatLPA(min)} - ${formatLPA(max)}`
    }

    return (
        <div className="home">
            <section className="hero">
                <div className="container">
                    <h1 className="fade-in">Find Your Dream Job</h1>
                    <p className="fade-in" style={{ animationDelay: '0.1s' }}>
                        Discover opportunities from top companies
                    </p>

                    <div className="search-container fade-in" style={{ animationDelay: '0.2s' }}>
                        <input
                            type="text"
                            placeholder="Search by job title, company, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            aria-label="Search jobs"
                        />

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="category-select"
                            aria-label="Filter by job category"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="jobs-section">
                <div className="container">
                    {loading ? (
                        <SkeletonJobGrid count={8} />
                    ) : paginatedJobs.length === 0 ? (
                        <div className="empty-state">
                            <h2>No jobs found</h2>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="sr-only">Available Jobs</h2>
                            <div className="job-grid fade-in">
                                {paginatedJobs.map(job => (
                                    <div
                                        key={job.id}
                                        className="job-card"
                                        onClick={() => navigate(`/jobs/${job.slug}`)}
                                    >
                                        <div className="job-header">
                                            <div>
                                                <h3 className="job-title">{job.title}</h3>
                                                <p className="company-name">{job.companyName}</p>
                                            </div>
                                        </div>

                                        <div className="job-meta">
                                            <span className="meta-item">📍 {job.location}</span>
                                            <span className="meta-item">💼 {job.jobType}</span>
                                            <span className="meta-item">🏢 {job.workMode}</span>
                                        </div>

                                        <div style={{ marginTop: '1rem' }}>
                                            <span className="badge badge-primary">{job.categoryName}</span>
                                            {job.remote && <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>Remote</span>}
                                        </div>

                                        {job.salaryMin && (
                                            <div className="salary">
                                                {formatSalary(job.salaryMin, job.salaryMax)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginTop: '3rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <button
                                        onClick={() => setCurrentPage(0)}
                                        disabled={currentPage === 0}
                                        className="btn"
                                        style={{
                                            padding: '0.5rem 1rem',
                                            opacity: currentPage === 0 ? 0.5 : 1,
                                            cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        « First
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                        className="btn"
                                        style={{
                                            padding: '0.5rem 1rem',
                                            opacity: currentPage === 0 ? 0.5 : 1,
                                            cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        ‹ Prev
                                    </button>

                                    {/* Page numbers */}
                                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {[...Array(totalPages)].map((_, index) => {
                                            // Show only relevant pages on mobile
                                            if (totalPages > 7) {
                                                if (
                                                    index === 0 ||
                                                    index === totalPages - 1 ||
                                                    (index >= currentPage - 1 && index <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentPage(index)}
                                                            className="btn"
                                                            style={{
                                                                padding: '0.5rem 0.75rem',
                                                                minWidth: '40px',
                                                                background: currentPage === index ? 'var(--primary)' : 'white',
                                                                color: currentPage === index ? 'white' : 'var(--text)',
                                                                fontWeight: currentPage === index ? 'bold' : 'normal'
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    )
                                                } else if (index === currentPage - 2 || index === currentPage + 2) {
                                                    return <span key={index} style={{ padding: '0.5rem' }}>...</span>
                                                }
                                                return null
                                            }
                                            // Show all pages if 7 or fewer
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentPage(index)}
                                                    className="btn"
                                                    style={{
                                                        padding: '0.5rem 0.75rem',
                                                        minWidth: '40px',
                                                        background: currentPage === index ? 'var(--primary)' : 'white',
                                                        color: currentPage === index ? 'white' : 'var(--text)',
                                                        fontWeight: currentPage === index ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {index + 1}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPage === totalPages - 1}
                                        className="btn"
                                        style={{
                                            padding: '0.5rem 1rem',
                                            opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                                            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Next ›
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(totalPages - 1)}
                                        disabled={currentPage === totalPages - 1}
                                        className="btn"
                                        style={{
                                            padding: '0.5rem 1rem',
                                            opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                                            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Last »
                                    </button>

                                    <div style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        marginTop: '1rem',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem'
                                    }}>
                                        Showing {startIndex + 1} - {Math.min(endIndex, totalFilteredJobs)} of {totalFilteredJobs} jobs
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Job Categories Section */}
            <section style={{ padding: '3rem 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Browse Jobs by Category</h2>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        justifyContent: 'center'
                    }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.slug)
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: selectedCategory === cat.slug ? 'var(--primary)' : 'white',
                                    color: selectedCategory === cat.slug ? 'white' : 'var(--text)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '500',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Categories Section */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Career Resources</h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Explore our blog for career tips, interview guides, and industry insights
                    </p>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={() => navigate('/blog')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                        >
                            📚 All Articles
                        </button>
                        <button
                            onClick={() => navigate('/blog')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'white',
                                color: 'var(--text)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                        >
                            💼 Career Tips
                        </button>
                        <button
                            onClick={() => navigate('/blog')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'white',
                                color: 'var(--text)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                        >
                            🎯 Interview Guides
                        </button>
                        <button
                            onClick={() => navigate('/blog')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'white',
                                color: 'var(--text)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                        >
                            📈 Industry Insights
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
