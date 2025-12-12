import { useState, useEffect } from 'react'
import axios from 'axios'

function CompanyManagement() {
    const [companies, setCompanies] = useState([])
    const [jobCounts, setJobCounts] = useState({}) // Track jobs per company
    const [expandedCompany, setExpandedCompany] = useState(null) // Track which company is expanded
    const [companyJobs, setCompanyJobs] = useState({}) // Store jobs for each company
    const [showForm, setShowForm] = useState(false)
    const [editingCompany, setEditingCompany] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleteConfirm, setDeleteConfirm] = useState(null) // {id, name, jobCount}

    const [formData, setFormData] = useState({
        name: '',
        website: '',
        logoUrl: '',
        about: ''
    })

    useEffect(() => {
        fetchCompanies() // This will also fetch job counts
    }, [])

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies/all')
            setCompanies(response.data)
            setLoading(false)
            // Fetch job counts after companies are loaded
            fetchJobCountsWithCompanies(response.data)
        } catch (error) {
            console.error('Error fetching companies:', error)
            setLoading(false)
        }
    }

    const fetchJobCountsWithCompanies = async (companiesList) => {
        try {
            const response = await axios.get('/api/jobs?size=1000')
            console.log('Fetched jobs for counting:', response.data.content.length, 'jobs')

            // Build a map: company name -> company id
            const companyNameToId = {}
            companiesList.forEach(company => {
                companyNameToId[company.name] = company.id
            })

            const counts = {}
            response.data.content.forEach(job => {
                const companyId = companyNameToId[job.companyName]
                if (companyId) {
                    counts[companyId] = (counts[companyId] || 0) + 1
                }
            })
            console.log('Job counts by company:', counts)
            setJobCounts(counts)
        } catch (error) {
            console.error('Error fetching job counts:', error)
        }
    }

    const fetchJobCounts = async () => {
        try {
            const response = await axios.get('/api/jobs?size=1000')
            console.log('Fetched jobs for counting:', response.data.content.length, 'jobs')

            // Build a map: company name -> company id
            const companyNameToId = {}
            companies.forEach(company => {
                companyNameToId[company.name] = company.id
            })

            const counts = {}
            response.data.content.forEach(job => {
                const companyId = companyNameToId[job.companyName]
                if (companyId) {
                    console.log('Job:', job.title, 'Company:', job.companyName, 'ID:', companyId)
                    counts[companyId] = (counts[companyId] || 0) + 1
                } else {
                    console.log('Job:', job.title, 'Company:', job.companyName, '- NOT MATCHED')
                }
            })
            console.log('Job counts by company:', counts)
            setJobCounts(counts)
        } catch (error) {
            console.error('Error fetching job counts:', error)
        }
    }

    const toggleCompanyJobs = async (companyId, companyName) => {
        // If clicking the same company, collapse it
        if (expandedCompany === companyId) {
            setExpandedCompany(null)
            return
        }

        // Expand this company
        setExpandedCompany(companyId)

        // If we already have the jobs, don't fetch again
        if (companyJobs[companyId]) {
            return
        }

        // Fetch jobs for this company
        try {
            const response = await axios.get('/api/jobs?size=1000')
            const jobs = response.data.content.filter(job => job.companyName === companyName)
            setCompanyJobs(prev => ({
                ...prev,
                [companyId]: jobs
            }))
        } catch (error) {
            console.error('Error fetching company jobs:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('=== COMPANY FORM SUBMIT TRIGGERED ===')
        console.log('Form Data:', formData)
        console.log('Editing Company:', editingCompany)

        try {
            if (editingCompany) {
                console.log('Updating company:', editingCompany.id)
                await axios.put(`/api/companies/${editingCompany.id}`, formData)
                alert('Company updated!')
            } else {
                console.log('Creating new company')
                await axios.post('/api/companies', formData)
                alert('Company created!')
            }
            setShowForm(false)
            setEditingCompany(null)
            resetForm()
            fetchCompanies()
        } catch (error) {
            console.error('Error saving company:', error)
            console.error('Error response:', error.response)

            // Check for duplicate company (unique constraint violation)
            if (error.response?.status === 500 &&
                error.response?.data?.message?.includes('Duplicate entry')) {
                alert('A company with this name already exists! Please use a different name.')
            } else if (error.response?.status === 403) {
                alert('Permission denied. Please refresh the page and try again.')
            } else if (error.response?.data?.message) {
                alert('Error: ' + error.response.data.message)
            } else {
                alert('Failed to save company. Error: ' + error.message)
            }
        }
    }

    const handleEdit = (company) => {
        setEditingCompany(company)
        setFormData({
            name: company.name || '',
            website: company.website || '',
            logoUrl: company.logoUrl || '',
            about: company.about || ''
        })
        setShowForm(true)
    }

    const handleDelete = (id) => {
        const jobCount = jobCounts[id] || 0
        const companyName = companies.find(c => c.id === id)?.name || 'this company'

        console.log('=== DELETE BUTTON CLICKED ===', { companyName, id, jobCount })

        // Show custom confirmation dialog
        setDeleteConfirm({ id, name: companyName, jobCount })
    }

    const confirmDelete = async () => {
        const { id, name } = deleteConfirm

        console.log('User confirmed - Sending DELETE to /api/companies/' + id)
        try {
            const response = await axios.delete(`/api/companies/${id}`)
            console.log('DELETE SUCCESS:', response)
            alert(`${name} deleted successfully!`)
            fetchCompanies()
            fetchJobCounts()
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
                alert('Company not found.')
            } else if (error.response?.data?.message) {
                alert('Error: ' + error.response.data.message)
            } else {
                alert('Failed to delete company. Error: ' + error.message)
            }
            fetchCompanies()
            fetchJobCounts()
        } finally {
            setDeleteConfirm(null)
        }
    }

    const cancelDelete = () => {
        console.log('User cancelled deletion')
        setDeleteConfirm(null)
    }

    const resetForm = () => {
        setFormData({ name: '', website: '', logoUrl: '', about: '' })
    }

    return (
        <div className="company-management">
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
                                    This company <strong>{deleteConfirm.name}</strong> has <strong>{deleteConfirm.jobCount} job(s)</strong> associated with it!
                                    <br /><br />
                                    Deleting this company will affect these jobs. Are you sure?
                                </>
                            ) : (
                                <>Delete <strong>{deleteConfirm.name}</strong>?</>
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
                <h2>Companies ({companies.length})</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => { setShowForm(!showForm); setEditingCompany(null); resetForm(); }}
                >
                    {showForm ? 'Cancel' : '+ Add Company'}
                </button>
            </div>

            {showForm ? (
                <div className="job-form-container" style={{ marginBottom: '2rem' }}>
                    <h3>{editingCompany ? 'Edit Company' : 'Add New Company'}</h3>
                    <form onSubmit={handleSubmit} className="job-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Company Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Website</label>
                                <input type="url" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://company.com" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Logo URL</label>
                            <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleInputChange} placeholder="https://logo.clearbit.com/company.com" />
                        </div>
                        <div className="form-group">
                            <label>About Company</label>
                            <textarea name="about" value={formData.about} onChange={handleInputChange} rows="4" placeholder="Brief description of the company..." />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingCompany ? 'Update Company' : 'Create Company'}
                            </button>
                            <button type="button" className="btn" onClick={() => { setShowForm(false); setEditingCompany(null); resetForm(); }}>
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
                                    <th>Website</th>
                                    <th>Jobs</th>
                                    <th>About</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map(company => (
                                    <>
                                        <tr key={company.id}>
                                            <td><strong>{company.name}</strong></td>
                                            <td>{company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer">Visit</a> : '-'}</td>
                                            <td>
                                                <span
                                                    onClick={() => toggleCompanyJobs(company.id, company.name)}
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        background: jobCounts[company.id] > 0 ? '#fef3c7' : '#e5e7eb',
                                                        color: jobCounts[company.id] > 0 ? '#92400e' : '#6b7280',
                                                        borderRadius: '4px',
                                                        fontWeight: '600',
                                                        cursor: jobCounts[company.id] > 0 ? 'pointer' : 'default',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}
                                                >
                                                    {jobCounts[company.id] || 0}
                                                    {jobCounts[company.id] > 0 && (
                                                        <span style={{ fontSize: '0.75rem' }}>
                                                            {expandedCompany === company.id ? '▲' : '▼'}
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td>{company.about ? company.about.substring(0, 80) + '...' : '-'}</td>
                                            <td className="actions">
                                                <button className="btn-small btn-edit" onClick={() => handleEdit(company)}>Edit</button>
                                                <button
                                                    className="btn-small btn-delete"
                                                    onClick={() => setDeleteConfirm({ id: company.id, name: company.name, jobCount: jobCounts[company.id] || 0 })}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Expandable row for jobs */}
                                        {expandedCompany === company.id && (
                                            <tr key={`${company.id}-jobs`}>
                                                <td colSpan="5" style={{
                                                    background: '#f9fafb',
                                                    padding: '1rem',
                                                    borderTop: '1px solid #e5e7eb'
                                                }}>
                                                    <div style={{ marginLeft: '2rem' }}>
                                                        <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: '#374151' }}>
                                                            Jobs at {company.name} ({companyJobs[company.id]?.length || 0})
                                                        </h4>
                                                        {companyJobs[company.id] && companyJobs[company.id].length > 0 ? (
                                                            <ul style={{
                                                                listStyle: 'none',
                                                                padding: 0,
                                                                display: 'grid',
                                                                gap: '0.5rem'
                                                            }}>
                                                                {companyJobs[company.id].map(job => (
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
                                                                            • {job.location} • {job.jobType}
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

export default CompanyManagement
