import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function BlogDetailPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBlogDetails()
    }, [slug])

    const fetchBlogDetails = async () => {
        try {
            console.log('Fetching blog with slug:', slug)
            const response = await axios.get(`https://api.jobfresh.in/api/blogs/${slug}`)
            console.log('Blog fetched successfully:', response.data)
            setBlog(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching blog:', error)
            console.error('Error status:', error.response?.status)
            console.error('Error data:', error.response?.data)
            console.error('Requested slug:', slug)
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="loading">Loading article...</div>
    }

    if (!blog) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Article not found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/blog')}>
                    Back to Blog
                </button>
            </div>
        )
    }

    return (
        <div className="blog-detail">
            <div className="container blog-detail-container">
                <button
                    onClick={() => navigate('/blog')}
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
                    ← Back to blog
                </button>

                <article className="job-details-card fade-in">
                    {blog.ogImage && (
                        <img
                            src={blog.ogImage}
                            alt={blog.title}
                            style={{
                                width: '100%',
                                maxHeight: '400px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginBottom: '1.5rem'
                            }}
                        />
                    )}
                    <h1 style={{ marginBottom: '1rem' }}>{blog.title}</h1>
                    {blog.category && (
                        <span style={{
                            background: '#e7f3ff',
                            color: '#0066cc',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            marginBottom: '1rem',
                            display: 'inline-block'
                        }}>
                            {blog.category.name}
                        </span>
                    )}
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        By {blog.authorName || 'Anonymous'} • {blog.createdAt || 'Unknown date'}
                        {blog.readingTimeMinutes && ` • ${blog.readingTimeMinutes} min read`}
                    </p>
                    <div
                        className="blog-content"
                        style={{
                            lineHeight: '1.8',
                            color: 'var(--text-primary)'
                        }}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </article>
            </div>
        </div>
    )
}

export default BlogDetailPage
