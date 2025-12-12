import { useState } from 'react'
import JobManagement from '../components/admin/JobManagement'
import CompanyManagement from '../components/admin/CompanyManagement'
import CategoryManagement from '../components/admin/CategoryManagement'
import BlogManagement from '../components/admin/BlogManagement'
import BlogCategoryManagement from '../components/admin/BlogCategoryManagement'
import UserManagement from '../components/admin/UserManagement'
import './AdminPage.css'

function AdminPage() {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userRole = user.role || ''

    // Define permissions for each role
    const canManageJobs = ['SUPER_ADMIN', 'ADMIN', 'JOB_MANAGER'].includes(userRole)
    const canManageBlogs = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'].includes(userRole)
    const canManageUsers = ['SUPER_ADMIN', 'ADMIN'].includes(userRole)

    // Set initial tab based on permissions
    const getInitialTab = () => {
        if (canManageJobs) return 'jobs'
        if (canManageBlogs) return 'blog'
        return 'jobs'
    }

    const [activeTab, setActiveTab] = useState(getInitialTab())

    return (
        <div className="admin-page">
            <div className="container" style={{ padding: '2rem 0', maxWidth: '1400px' }}>
                <h1 style={{ marginBottom: '2rem' }}>Admin Panel</h1>

                {/* Tab Navigation */}
                <div className="tab-nav">
                    {canManageJobs && (
                        <>
                            <button
                                className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
                                onClick={() => setActiveTab('jobs')}
                            >
                                📋 Jobs Management
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'companies' ? 'active' : ''}`}
                                onClick={() => setActiveTab('companies')}
                            >
                                🏢 Companies Management
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
                                onClick={() => setActiveTab('categories')}
                            >
                                🏷️ Categories Management
                            </button>
                        </>
                    )}
                    {canManageBlogs && (
                        <>
                            <button
                                className={`tab-button ${activeTab === 'blog' ? 'active' : ''}`}
                                onClick={() => setActiveTab('blog')}
                            >
                                📝 Blog Posts
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'blog-categories' ? 'active' : ''}`}
                                onClick={() => setActiveTab('blog-categories')}
                            >
                                📚 Blog Categories
                            </button>
                        </>
                    )}
                    {canManageUsers && (
                        <button
                            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            👥 Users
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'jobs' && <JobManagement />}
                    {activeTab === 'companies' && <CompanyManagement />}
                    {activeTab === 'categories' && <CategoryManagement />}
                    {activeTab === 'blog' && <BlogManagement />}
                    {activeTab === 'blog-categories' && <BlogCategoryManagement />}
                    {activeTab === 'users' && <UserManagement />}
                </div>
            </div>
        </div>
    )
}

export default AdminPage
