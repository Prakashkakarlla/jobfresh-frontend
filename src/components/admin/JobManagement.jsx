import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function JobManagement() {
    const [jobs, setJobs] = useState([])
    const [companies, setCompanies] = useState([])
    const [categories, setCategories] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingJob, setEditingJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '', location: '', remote: false, jobType: 'Full-time', status: 'DRAFT',
        applicationLink: '', companyId: '', categoryId: '', roleSummary: '',
        responsibilities: '', mustHaveSkills: '', niceToHaveSkills: '',
        eligibleBatch: '', qualification: '', experienceLevel: '', lastDateToApply: '',
        eligibilityCriteria: '', interviewTips: '', selectionProcess: '',
        careerGrowthInfo: '', futureRoles: '', salaryMin: '', salaryMax: '',
        currency: 'INR', workMode: 'Hybrid',
    })

    useEffect(() => {
        fetchJobs()
        fetchCompanies()
        fetchCategories()
    }, [])

    const fetchJobs = async () => {
        try {
            const response = await axios.get('/api/jobs?size=100')
            setJobs(response.data.content)
            setLoading(false)
        } catch (error) {
            console.error('Error:', error)
            setLoading(false)
        }
    }

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies/all')
            setCompanies(response.data)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories/all')
            setCategories(response.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                companyId: parseInt(formData.companyId),
                categoryId: parseInt(formData.categoryId),
                salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
                salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
            }

            if (editingJob) {
                await axios.put(`/api/jobs/${editingJob.slug}`, payload)
                alert('Job updated!')
            } else {
                await axios.post('/api/jobs', payload)
                alert('Job created!')
            }

            setShowForm(false)
            setEditingJob(null)
            resetForm()
            fetchJobs()
        } catch (error) {
            console.error('Error:', error)
            alert('Error: ' + (error.response?.data?.message || error.message))
        }
    }

    const handleEdit = async (job) => {
        try {
            // Fetch full job details from detail endpoint
            const response = await axios.get(`/api/jobs/${job.slug}`)
            const fullJob = response.data

            setEditingJob(fullJob)

            // Detail API returns company and category as objects, not just names
            const companyName = fullJob.company?.name || job.companyName
            const categoryName = fullJob.category?.name || job.categoryName

            // Find company ID from company name
            const companyId = companies.find(c => c.name === companyName)?.id || ''
            // Find category ID from category name  
            const categoryId = categories.find(c => c.name === categoryName)?.id || ''

            console.log('Edit job - Company mapping:', companyName, '->', companyId)
            console.log('Edit job - Category mapping:', categoryName, '->', categoryId)

            setFormData({
                title: fullJob.title || '',
                location: fullJob.location || '',
                remote: fullJob.remote || false,
                jobType: fullJob.jobType || 'Full-time',
                status: fullJob.status || 'DRAFT',
                applicationLink: fullJob.applicationLink || '',
                companyId: String(companyId), // Convert to string for select
                categoryId: String(categoryId), // Convert to string for select
                roleSummary: fullJob.roleSummary || '',
                responsibilities: fullJob.responsibilities || '',
                mustHaveSkills: fullJob.mustHaveSkills || '',
                niceToHaveSkills: fullJob.niceToHaveSkills || '',
                eligibleBatch: fullJob.eligibleBatch || '',
                qualification: fullJob.qualification || '',
                experienceLevel: fullJob.experienceLevel || '',
                lastDateToApply: fullJob.lastDateToApply || '',
                eligibilityCriteria: fullJob.eligibilityCriteria || '',
                interviewTips: fullJob.interviewTips || '',
                selectionProcess: fullJob.selectionProcess || '',
                careerGrowthInfo: fullJob.careerGrowthInfo || '',
                futureRoles: fullJob.futureRoles || '',
                salaryMin: fullJob.salaryMin || '',
                salaryMax: fullJob.salaryMax || '',
                currency: fullJob.currency || 'INR',
                workMode: fullJob.workMode || 'Hybrid',
            })
            console.log('Form populated with companyId:', String(companyId), 'categoryId:', String(categoryId))
            setShowForm(true)
        } catch (error) {
            console.error('Error fetching job details for edit:', error)
            alert('Error loading job details. Please try again.')
        }
    }

    const handleDelete = async (slug) => {
        if (!window.confirm('Delete this job?')) return
        try {
            await axios.delete(`/api/jobs/${slug}`)
            alert('Job deleted!')
            fetchJobs()
        } catch (error) {
            console.error('Error:', error)
            alert('Error deleting job')
        }
    }

    const resetForm = () => {
        setFormData({
            title: '', location: '', remote: false, jobType: 'Full-time', status: 'DRAFT',
            applicationLink: '', companyId: '', categoryId: '', roleSummary: '',
            responsibilities: '', mustHaveSkills: '', niceToHaveSkills: '',
            eligibleBatch: '', qualification: '', experienceLevel: '', lastDateToApply: '',
            eligibilityCriteria: '', interviewTips: '', selectionProcess: '',
            careerGrowthInfo: '', futureRoles: '', salaryMin: '', salaryMax: '',
            currency: 'INR', workMode: 'Hybrid',
        })
    }

    return (
        <div className="job-management">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2>Jobs ({jobs.length})</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => { setShowForm(!showForm); setEditingJob(null); resetForm(); }}
                >
                    {showForm ? 'Cancel' : '+ Create Job'}
                </button>
            </div>

            {showForm ? (
                <div className="job-form-container">
                    <h2>{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
                    <form onSubmit={handleSubmit} className="job-form">

                        <div className="form-section">
                            <h3>Basic Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Job Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Location *</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Job Type *</label>
                                    <select name="jobType" value={formData.jobType} onChange={handleInputChange} required>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status *</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} required>
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Company *</label>
                                    <select name="companyId" value={formData.companyId} onChange={handleInputChange} required>
                                        <option value="">Select Company</option>
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <small style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                        Tip: Add companies in the Companies tab first!
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Work Mode</label>
                                    <select name="workMode" value={formData.workMode} onChange={handleInputChange}>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Remote">Remote</option>
                                        <option value="On-site">On-site</option>
                                    </select>
                                </div>
                                <div className="form-group checkbox-group">
                                    <label>
                                        <input type="checkbox" name="remote" checked={formData.remote} onChange={handleInputChange} />
                                        Remote Available
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Fresher & Eligibility Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Eligible Batch</label>
                                    <input type="text" name="eligibleBatch" value={formData.eligibleBatch} onChange={handleInputChange} placeholder="2024/2025" />
                                </div>
                                <div className="form-group">
                                    <label>Qualification</label>
                                    <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="B.E/B.Tech/MCA" />
                                </div>
                                <div className="form-group">
                                    <label>Experience Level</label>
                                    <input type="text" name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} placeholder="Freshers" />
                                </div>
                                <div className="form-group">
                                    <label>Last Date to Apply</label>
                                    <input type="date" name="lastDateToApply" value={formData.lastDateToApply} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Salary</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Min Salary (₹/year)</label>
                                    <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Max Salary (₹/year)</label>
                                    <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Job Description</h3>
                            <div className="form-group">
                                <label>Role Summary *</label>
                                <textarea name="roleSummary" value={formData.roleSummary} onChange={handleInputChange} rows="3" required />
                            </div>
                            <div className="form-group">
                                <label>Responsibilities</label>
                                <textarea name="responsibilities" value={formData.responsibilities} onChange={handleInputChange} rows="5" />
                            </div>
                            <div className="form-group">
                                <label>Must Have Skills</label>
                                <textarea name="mustHaveSkills" value={formData.mustHaveSkills} onChange={handleInputChange} rows="3" />
                            </div>
                            <div className="form-group">
                                <label>Nice to Have Skills</label>
                                <textarea name="niceToHaveSkills" value={formData.niceToHaveSkills} onChange={handleInputChange} rows="2" />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Eligibility & Selection</h3>
                            <div className="form-group">
                                <label>Eligibility Criteria</label>
                                <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleInputChange} rows="4" />
                            </div>
                            <div className="form-group">
                                <label>Interview Tips</label>
                                <textarea name="interviewTips" value={formData.interviewTips} onChange={handleInputChange} rows="4" />
                            </div>
                            <div className="form-group">
                                <label>Selection Process</label>
                                <textarea name="selectionProcess" value={formData.selectionProcess} onChange={handleInputChange} rows="4" />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Career Growth</h3>
                            <div className="form-group">
                                <label>Career Growth Information</label>
                                <textarea name="careerGrowthInfo" value={formData.careerGrowthInfo} onChange={handleInputChange} rows="3" />
                            </div>
                            <div className="form-group">
                                <label>Future Roles</label>
                                <input type="text" name="futureRoles" value={formData.futureRoles} onChange={handleInputChange} placeholder="Senior Analyst, Consultant" />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Application Details</h3>
                            <div className="form-group">
                                <label>Application Link *</label>
                                <input type="url" name="applicationLink" value={formData.applicationLink} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingJob ? 'Update Job' : 'Create Job'}
                            </button>
                            <button type="button" className="btn" onClick={() => { setShowForm(false); setEditingJob(null); resetForm(); }}>
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
                                    <th>Title</th>
                                    <th>Company</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Batch</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job.id}>
                                        <td>{job.title}</td>
                                        <td>{job.companyName}</td>
                                        <td>{job.location}</td>
                                        <td><span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span></td>
                                        <td>{job.eligibleBatch || '-'}</td>
                                        <td className="actions">
                                            <button className="btn-small btn-edit" onClick={() => handleEdit(job)}>Edit</button>
                                            <button className="btn-small btn-delete" onClick={() => handleDelete(job.slug)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    )
}

export default JobManagement
