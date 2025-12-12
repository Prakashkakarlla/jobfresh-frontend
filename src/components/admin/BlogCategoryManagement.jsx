import { useState, useEffect } from 'react'
import axios from 'axios'
import './BlogCategoryManagement.css'

function BlogCategoryManagement() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        displayOrder: 0
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/blog-categories')
            setCategories(response.data)
            setLoading(false)
        } catch (err) {
            setError('Failed to load categories')
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            setFormData(prev => ({ ...prev, slug }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingCategory) {
                await axios.put(
                    `https://api.jobfresh.in/api/blog-categories/${editingCategory.id}`,
                    formData
                )
            } else {
                await axios.post('https://api.jobfresh.in/api/blog-categories', formData)
            }
            fetchCategories()
            closeModal()
        } catch (err) {
            setError('Failed to save category')
        }
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            displayOrder: category.displayOrder || 0
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return

        try {
            await axios.delete(`https://api.jobfresh.in/api/blog-categories/${id}`)
            fetchCategories()
        } catch (err) {
            setError('Failed to delete category')
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingCategory(null)
        setFormData({
            name: '',
            slug: '',
            description: '',
            displayOrder: 0
        })
    }

    if (loading) return <div className="loading">Loading categories...</div>

    return (
        <div className="blog-category-management">
            <div className="header">
                <h2>Blog Categories</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Add Category
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="categories-table">
                <table>
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.displayOrder}</td>
                                <td><strong>{category.name}</strong></td>
                                <td><code>{category.slug}</code></td>
                                <td>{category.description}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(category)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                />
                                <small>URL-friendly identifier (auto-generated)</small>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Display Order</label>
                                <input
                                    type="number"
                                    name="displayOrder"
                                    value={formData.displayOrder}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BlogCategoryManagement
