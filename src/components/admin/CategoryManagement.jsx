import { useState, useEffect } from 'react'
import axios from 'axios'

function CategoryManagement() {
    const [categories, setCategories] = useState([])
    const [jobCounts, setJobCounts] = useState({}) // Track jobs per category
    const [expandedCategory, setExpandedCategory] = useState(null) // Track which category is expanded
    const [categoryJobs, setCategoryJobs] = useState({}) // Store jobs for each category
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleteConfirm, setDeleteConfirm] = useState(null) // {id, name, jobCount}

    const [formData, setFormData] = useState({
        name: '',
        introText: '',
        careerGuide: '',
        faq: '',
        seoTitle: '',
        seoDescription: ''
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/categories/all')
            setCategories(response.data)
            setLoading(false)
            // Fetch job counts after categories are loaded
            fetchJobCountsWithCategories(response.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
            setLoading(false)
        }
    }

    const fetchJobCountsWithCategories = async (categoriesList) => {
        try {
            const response = await axios.get('https://api.jobfresh.in/api/jobs?size=1000')

            // Build a map: category name -> category id
            const categoryNameToId = {}
            categoriesList.forEach(category => {
                categoryNameToId[category.name] = category.id
            })

            const counts = {}
            response.data.content.forEach(job => {
                const categoryId = categoryNameToId[job.categoryName]
                if (categoryId) {
                    counts[categoryId] = (counts[categoryId] || 0) + 1
                }
            })
            console.log('Job counts by category:', counts)
            setJobCounts(counts)
        } catch (error) {
            console.error('Error fetching job counts:', error)
        }
    }

    const toggleCategoryJobs = async (categoryId, categoryName) => {
        // If clicking the same category, collapse it
        if (expandedCategory === categoryId) {
            setExpandedCategory(null)
            return
        }

        // Expand this category
        setExpandedCategory(categoryId)

        // If we already have the jobs, don't fetch again
        if (categoryJobs[categoryId]) {
            return
        }

        // Fetch jobs for this category
        try {
            const response = await axios.get('https://api.jobfresh.in/api/jobs?size=1000')
            const jobs = response.data.content.filter(job => job.categoryName === categoryName)
            setCategoryJobs(prev => ({
                ...prev,
                [categoryId]: jobs
            }))
        } catch (error) {
            console.error('Error fetching category jobs:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingCategory) {
                await axios.put(`/ api / categories / ${editingCategory.id} `, formData)
                alert('Category updated!')
            } else {
                await axios.post('https://api.jobfresh.in/api/categories', formData)
                alert('Category created!')
            }
            setShowForm(false)
            setEditingCategory(null)
            resetForm()
            fetchCategories()
        } catch (error) {
            console.error('Error saving category:', error)
            if (error.response?.status === 500 &&
                error.response?.data?.message?.includes('Duplicate entry')) {
                alert('A category with this name already exists! Please use a different name.')
            } else {
                alert('Error: ' + (error.response?.data?.message || error.message))
            }
        }
    }

    const handleEdit = (category) => {
        console.log('Editing category:', category)
        setEditingCategory(category)
        setFormData({
            name: category.name || '',
            introText: category.introText || '',
            careerGuide: category.careerGuide || '',
            faq: category.faq || '',
            seoTitle: category.seoTitle || '',
            seoDescription: category.seoDescription || ''
        })
        console.log('Form data set to:', {
            name: category.name,
            introText: category.introText,
            careerGuide: category.careerGuide,
            faq: category.faq
        })
        setShowForm(true)
    }

    const handleDelete = (id) => {
        const jobCount = jobCounts[id] || 0
        const categoryName = categories.find(c => c.id === id)?.name || 'this category'

        console.log('=== DELETE INITIATED ===', { categoryName, id, jobCount })

        // Show custom confirmation dialog
        setDeleteConfirm({ id, name: categoryName, jobCount })
    }

    const confirmDelete = async () => {
        const { id, name } = deleteConfirm

        console.log('User confirmed - Sending DELETE to /api/categories/' + id)
        try {
            const response = await axios.delete(`/ api / categories / ${id} `)
            console.log('DELETE SUCCESS:', response)
            alert(`${name} deleted successfully!`)
            fetchCategories()
        } catch (error) {
            console.error('=== DELETE FAILED ===')
            console.error('Status:', error.response?.status)
            console.error('Data:', error.response?.data)

            if (error.response?.status === 500) {
                const errorMsg = error.response?.data?.message || JSON.stringify(error.response?.data)
                alert('⚠️ Server Error!\n\n' + errorMsg)
            } else if (error.response?.status === 403) {
                alert('Permission denied. Please refresh the page and try again.')
            } else if (error.response?.status === 404) {
                alert('Category not found.')
            } else if (error.response?.data?.message) {
                alert('Error: ' + error.response.data.message)
            } else {
                alert('Failed to delete category. Error: ' + error.message)
            }
            fetchCategories()
        } finally {
            setDeleteConfirm(null)
        }
    }

    const cancelDelete = () => {
        console.log('User cancelled deletion')
        setDeleteConfirm(null)
    }

    const resetForm = () => {
        setFormData({
            name: '',
            introText: '',
            careerGuide: '',
            faq: '',
            seoTitle: '',
            seoDescription: ''
        })
    }

    return (
        <div className="category-management">
            {/* Custom Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ marginTop: 0, color: deleteConfirm.jobCount > 0 ? '#dc2626' : '#1f2937' }}>
                            {deleteConfirm.jobCount > 0 ? '⚠️ Warning!' : 'Confirm Delete'}
                        </h3>
                        <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                            {deleteConfirm.jobCount > 0 ? (
                                <>
                                    Category <strong>{deleteConfirm.name}</strong> has <strong>{deleteConfirm.jobCount} job(s)</strong> using it!
                                    <br /><br />
                                    Deleting this category will affect these jobs. Are you sure?
                                </>
                            ) : (
                                <>Delete category <strong>{deleteConfirm.name}</strong>?</>
                            )}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                onClick={cancelDelete}
                                className="btn"
                                style={{ background: '#6b7280' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn btn-primary"
                                style={{ background: '#dc2626' }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Categories ({categories.length})</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => { setShowForm(!showForm); setEditingCategory(null); resetForm(); }}
                >
                    {showForm ? 'Cancel' : '+ Add Category'}
                </button>
            </div>

            {showForm ? (
                <div className="job-form-container" style={{ marginBottom: '2rem' }}>
                    <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                    <form onSubmit={handleSubmit} className="job-form">
                        <div className="form-group">
                            <label>Category Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Software Development"
                            />
                        </div>

                        <div className="form-group">
                            <label>Introduction Text</label>
                            <textarea
                                name="introText"
                                value={formData.introText}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Brief introduction about this job category..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Career Guide</label>
                            <textarea
                                name="careerGuide"
                                value={formData.careerGuide}
                                onChange={handleInputChange}
                                rows="5"
                                placeholder="Career path information, skills required, etc..."
                            />
                        </div>

                        <div className="form-group">
                            <label>FAQ</label>
                            <textarea
                                name="faq"
                                value={formData.faq}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Frequently asked questions about this category..."
                            />
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>SEO Title</label>
                                <input
                                    type="text"
                                    name="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={handleInputChange}
                                    placeholder="For search engines"
                                />
                            </div>
                            <div className="form-group">
                                <label>SEO Description</label>
                                <input
                                    type="text"
                                    name="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={handleInputChange}
                                    placeholder="Meta description"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => { setShowForm(false); setEditingCategory(null); resetForm(); }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="jobs-table">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Jobs</th>
                                    <th>Intro</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <>
                                        <tr key={category.id}>
                                            <td><strong>{category.name}</strong></td>
                                            <td><code>{category.slug}</code></td>
                                            <td>
                                                <span
                                                    onClick={() => toggleCategoryJobs(category.id, category.name)}
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        background: jobCounts[category.id] > 0 ? '#fef3c7' : '#e5e7eb',
                                                        color: jobCounts[category.id] > 0 ? '#92400e' : '#6b7280',
                                                        borderRadius: '4px',
                                                        fontWeight: '600',
                                                        cursor: jobCounts[category.id] > 0 ? 'pointer' : 'default',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}
                                                >
                                                    {jobCounts[category.id] || 0}
                                                    {jobCounts[category.id] > 0 && (
                                                        <span style={{ fontSize: '0.75rem' }}>
                                                            {expandedCategory === category.id ? '▲' : '▼'}
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td>{category.introText ? category.introText.substring(0, 50) + '...' : '-'}</td>
                                            <td className="actions">
                                                <button className="btn-small btn-edit" onClick={() => handleEdit(category)}>Edit</button>
                                                <button
                                                    className="btn-small btn-delete"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        handleDelete(category.id)
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Expandable row for jobs */}
                                        {expandedCategory === category.id && (
                                            <tr key={`${category.id} -jobs`}>
                                                <td colSpan="5" style={{
                                                    background: '#f9fafb',
                                                    padding: '1rem',
                                                    borderTop: '1px solid #e5e7eb'
                                                }}>
                                                    <div style={{ marginLeft: '2rem' }}>
                                                        <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: '#374151' }}>
                                                            Jobs in {category.name} ({categoryJobs[category.id]?.length || 0})
                                                        </h4>
                                                        {categoryJobs[category.id] && categoryJobs[category.id].length > 0 ? (
                                                            <ul style={{
                                                                listStyle: 'none',
                                                                padding: 0,
                                                                display: 'grid',
                                                                gap: '0.5rem'
                                                            }}>
                                                                {categoryJobs[category.id].map(job => (
                                                                    <li key={job.id} style={{
                                                                        padding: '0.5rem',
                                                                        background: 'white',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid #e5e7eb',
                                                                        fontSize: '0.9rem'
                                                                    }}>
                                                                        <strong>{job.title}</strong>
                                                                        <span style={{
                                                                            marginLeft: '0.5rem',
                                                                            color: '#6b7280',
                                                                            fontSize: '0.85rem'
                                                                        }}>
                                                                            • {job.companyName} • {job.location} • {job.jobType}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading jobs...</p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    )
}

export default CategoryManagement
