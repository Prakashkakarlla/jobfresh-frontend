import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SkeletonBlogGrid } from '../components/Skeleton'
import { cache, CACHE_KEYS } from '../utils/cache'

// Helper function to strip HTML tags from content
const stripHtml = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
}

function BlogPage() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        try {
            // Check cache first
            const cachedBlogs = cache.get(CACHE_KEYS.BLOG_POSTS)
            if (cachedBlogs) {
                setBlogs(cachedBlogs)
                setLoading(false)
                return
            }

            const response = await axios.get('https://api.jobfresh.in/api/blogs')
            setBlogs(response.data || [])
            cache.set(CACHE_KEYS.BLOG_POSTS, response.data || [])
            setLoading(false)
        } catch (error) {
            console.error('Error fetching blogs:', error)
            setLoading(false)
        }
    }

    return (
        <div className="blog-page">
            <section className="hero" style={{ padding: '3rem 0' }}>
                <div className="container">
                    <h1>Career Guides & Tips</h1>
                    <p>Expert advice to advance your tech career</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    {loading ? (
                        <SkeletonBlogGrid count={6} />
                    ) : blogs.length === 0 ? (
                        <div className="empty-state">
                            <h2>No blog posts yet</h2>
                            <p>Check back soon for career tips and guides!</p>
                        </div>
                    ) : (
                        <div className="blog-grid fade-in">
                            {blogs.map(blog => (
                                <div
                                    key={blog.id}
                                    className="blog-card"
                                    onClick={() => navigate(`/blog/${blog.slug}`)}
                                >
                                    <div className="blog-image" style={{
                                        backgroundImage: blog.ogImage ? `url(${blog.ogImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}></div>
                                    <div className="blog-content">
                                        <h3 className="blog-title">{blog.title}</h3>
                                        <p className="blog-excerpt">{stripHtml(blog.content)?.substring(0, 150)}...</p>
                                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <span>By {blog.authorName || 'Anonymous'}</span>
                                            <span>• {blog.category?.name || 'Uncategorized'}</span>
                                            {blog.createdAt && <span>• {blog.createdAt}</span>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default BlogPage
