import { useState, useEffect } from 'react'
import axios from 'axios'
import './BlogManagement.css'

function BlogManagement() {
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingPost, setEditingPost] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
        status: 'DRAFT',
        featured: false,
        metaDescription: '',
        metaKeywords: '',
        ogImage: ''
    })

    useEffect(() => {
        fetchPosts()
        fetchCategories()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/blogs')
            setPosts(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching posts:', error)
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/blog-categories')
            setCategories(response.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
            }

            if (editingPost) {
                await axios.put(`https://api.jobfresh.in/api/blogs/${editingPost.id}`, payload)
            } else {
                await axios.post('https://api.jobfresh.in/api/blogs', payload)
            }
            fetchPosts()
            closeModal()
        } catch (error) {
            console.error('Error saving post:', error)
            alert('Failed to save blog post')
        }
    }

    const handleEdit = (post) => {
        setEditingPost(post)
        setFormData({
            title: post.title,
            content: post.content,
            categoryId: post.category?.id || '',
            status: post.status || 'DRAFT',
            featured: post.featured || false,
            metaDescription: post.metaDescription || '',
            metaKeywords: post.metaKeywords || '',
            ogImage: post.ogImage || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return

        try {
            await axios.delete(`https://api.jobfresh.in/api/blogs/${id}`)
            fetchPosts()
        } catch (error) {
            console.error('Error deleting post:', error)
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingPost(null)
        setFormData({
            title: '',
            content: '',
            categoryId: '',
            status: 'DRAFT',
            featured: false,
            metaDescription: '',
            metaKeywords: '',
            ogImage: ''
        })
    }

    const getStatusBadge = (status) => {
        const badges = {
            DRAFT: '🟡 Draft',
            PUBLISHED: '🟢 Published',
            ARCHIVED: '⚫ Archived'
        }
        return badges[status] || status
    }

    if (loading) return <div className="loading">Loading posts...</div>

    return (
        <div className="blog-management">
            <div className="header">
                <h2>Blog Posts</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + New Post
                </button>
            </div>

            <div className="posts-grid">
                {posts.map(post => (
                    <div key={post.id} className="post-card">
                        <div className="post-header">
                            <h3>{post.title}</h3>
                            <div className="post-badges">
                                {post.featured && <span className="badge-featured">⭐ Featured</span>}
                                <span className="badge-status">{getStatusBadge(post.status)}</span>
                            </div>
                        </div>

                        {post.category && (
                            <div className="post-category">
                                📚 {post.category.name}
                            </div>
                        )}

                        <div className="post-meta">
                            <span>👁️ {post.viewCount || 0} views</span>
                            <span>📖 {post.readingTimeMinutes || 0} min read</span>
                            {post.authorName && <span>✍️ {post.authorName}</span>}
                        </div>

                        <div className="post-content-preview">
                            {post.content?.substring(0, 150)}...
                        </div>

                        <div className="post-actions">
                            <button className="btn-edit" onClick={() => handleEdit(post)}>
                                Edit
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(post.id)}>
                                Delete
                            </button>
                        </div>

                        <div className="post-footer">
                            Created: {post.createdAt}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                        <h3>{editingPost ? 'Edit Post' : 'New Blog Post'}</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">-- Select Category --</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Content *</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    rows="10"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="ARCHIVED">Archived</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                        />
                                        <span>⭐ Featured Post</span>
                                    </label>
                                </div>
                            </div>

                            <h4>SEO Settings</h4>

                            <div className="form-group">
                                <label>Meta Description</label>
                                <textarea
                                    value={formData.metaDescription}
                                    onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                    rows="2"
                                    maxLength="255"
                                    placeholder="Brief description for search engines (max 255 characters)"
                                />
                                <small>{formData.metaDescription.length}/255</small>
                            </div>

                            <div className="form-group">
                                <label>Meta Keywords</label>
                                <input
                                    type="text"
                                    value={formData.metaKeywords}
                                    onChange={e => setFormData({ ...formData, metaKeywords: e.target.value })}
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                            </div>

                            <div className="form-group">
                                <label>OG Image URL</label>
                                <input
                                    type="url"
                                    value={formData.ogImage}
                                    onChange={e => setFormData({ ...formData, ogImage: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                                <small>Image for social media sharing</small>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingPost ? 'Update Post' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BlogManagement
